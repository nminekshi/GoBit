// Using built-in fetch

async function fetchLatestLenovo() {
    try {
        const response = await fetch('http://localhost:4000/auctions');
        const data = await response.json();

        // Find the Lenovo one created most recently
        const lenovos = data.filter(a => a.title && a.title.toLowerCase().includes('lenovo') || a.description && a.description.toLowerCase().includes('lenovo'));

        if (lenovos.length > 0) {
            console.log(`Found ${lenovos.length} Lenovo auctions.`);
            const latest = lenovos[0]; // backend sorts by createdAt -1 (descending), so first is latest
            console.log("Latest Lenovo Auction:");
            console.log(JSON.stringify(latest, null, 2));
        } else {
            console.log("No Lenovo auctions found.");
            // Log first 3 auctions to see what's there
            console.log("Latest 3 auctions:", JSON.stringify(data.slice(0, 3), null, 2));
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchLatestLenovo();
