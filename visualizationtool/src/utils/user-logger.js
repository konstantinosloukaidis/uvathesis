export const logActivity = async (info, startTime, setStartTime, currentLogValue, setCurrentLogValue) => {
    const now = new Date();
    if (startTime && currentLogValue) {
      const timeSpent = (now - startTime) / 1000;

      try {
        if (timeSpent > 0.05){
            await fetch('/api/log', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...info,
                    time: timeSpent,
                    timestamp: now.toISOString()
                })
            });
        }
      } catch (error) {
        console.error('Error logging time spent', error);
      }
    }

    if (setStartTime) setStartTime(now);
    if (setCurrentLogValue) setCurrentLogValue(currentLogValue);
};