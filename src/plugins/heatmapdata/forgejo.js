export async function fetchForgejoData(instance, username) {
    const response = await fetch(`https://${instance}/api/v1/users/${username}/heatmap`);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = []
    const rdata = await response.json();
    Object.values(rdata).forEach((s) => {
        data.push([
            new Date(s.timestamp * 1000).toISOString().split('T')[0], // Convert seconds to milliseconds
            s.contributions,
        ])
    })

    return data
}
