import {parse} from "ultrahtml"
import { querySelector, querySelectorAll } from "ultrahtml/selector";

async function fetchYears(username) {
    const data = await fetch(`https://github.com/${username}?tab=contributions`, {
        headers: {
            "x-requested-with": "XMLHttpRequest"
        }
    });
    const body = await data.text();
    const rhtml = parse(body);
    return querySelectorAll(rhtml,".js-year-link.filter-item")
        .map((a) => {
            const aEle = querySelector(a, "a");
            const href = aEle.attributes.href;
            const githubUrl = new URL(`https://github.com${href}`);
            githubUrl.searchParams.set("tab", "contributions");
            const formattedHref = `${githubUrl.pathname}${githubUrl.search}`;

            return {
                href: formattedHref,
                text: aEle.text
            };
        });
}

async function fetchDataForYear(url, year, format) {
    const data = await fetch(`https://github.com${url}`, {
        headers: {
            "x-requested-with": "XMLHttpRequest"
        }
    });
    const rhtml = parse(await data.text());

    const days = querySelectorAll(rhtml, "table.ContributionCalendar-grid td.ContributionCalendar-day");
    const contribText = querySelector(rhtml,".js-yearly-contributions h2").children[0].value
        .trim()
        .match(/^([0-9,]+)\s/);
    let contribCount;
    if (contribText) {
        [contribCount] = contribText;
        contribCount = parseInt(contribCount.replace(/,/g, ""), 10);
    }
    return {
        year,
        total: contribCount || 0,
        range: {
            start: days[0].attributes['data-date'],
            end: days[days.length - 1].attributes['data-date']
        },
        contributions: (() => {
            const parseDay = (day, index) => {
                const date = day.attributes['data-date'].split("-")
                    .map((d) => parseInt(d, 10));
                const value = {
                    date: day.attributes['data-date'],
                    count: parseInt(day.attributes['data-level']) || 0
                };
                return { date, value };
            };

            if (format !== "nested") {
                return days.map((day, index) => parseDay(day, index).value);
            }

            return days.reduce((o, day, index) => {
                const { date, value } = parseDay(day, index);
                const [y, m, d] = date;
                if (!o[y]) o[y] = {};
                if (!o[y][m]) o[y][m] = {};
                o[y][m][d] = value;
                return o;
            }, {});
        })()
    };
}

export async function fetchDataForAllYears(username, format) {
    const years = await fetchYears(username);
    return Promise.all(
        years.map((year) => fetchDataForYear(year.href, year.text, format))
    ).then((resp) => {
        // ECharts compatible format: [[date, value], ...]
        return resp
            .reduce((list, curr) => [...list, ...curr.contributions], [])
            .filter((item) => item.count > 0)
            .sort((a, b) => {
                if (a.date < b.date) return -1;
                else if (a.date > b.date) return 1;
                return 0;
            })
            .map(item => [item.date, item.count]);
    });
}