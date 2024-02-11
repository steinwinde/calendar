const getDateTime = (id, weeks) => {
    for(let week of weeks) {
        for(let day of week.days) {
            const foundDateTime = day.dateTimes.find(dateTime => {return dateTime.id === id}); 
            if(foundDateTime) {
                return foundDateTime;
            } 
        }
    }
    // should never happen
    throw new Error('Could not find dateTime with id: ' + id);
}

export { getDateTime };