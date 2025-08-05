function formatTimString(date) {
    // Convert UTC time to IST (UTC+5:30)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const istTime = new Date(date.getTime() + istOffset);

    const year = istTime.getFullYear() - 1900; // Convert to TIM format (2025 → 125)
    const month = istTime.getMonth(); // 0-based (Jan = 0, Dec = 11)
    const day = istTime.getDate();
    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();
    const seconds = istTime.getSeconds();

    return `*TIM,${day},${month},${year},${hours},${minutes},${seconds}#`;
}

module.exports=formatTimString;


