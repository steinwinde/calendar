public with sharing class EventCalendarController {
    
    @AuraEnabled
    public static List<Event> getEvents(DateTime dt){
        Date d = Date.newInstance(dt.year(), dt.month(), dt.day());
        try {
            Date firstDayOfMonth = d.toStartOfMonth();
            Date lastDayOfMonth = d.toStartOfMonth().addMonths(1).addDays(-1);
            
            List<Event> events = [
                SELECT 
                    IsAllDayEvent, StartDateTime, EndDateTime, Subject
                FROM Event
                WHERE StartDateTime >= :firstDayOfMonth AND EndDateTime <= :lastDayOfMonth
            ];
            return events;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Date> getPublicHolidays(Date d) {
        List<Date> dates = new List<Date>();
        if(d == null) {
            return dates;
        }
        Map<Date, String> publicHolidays = PublicHolidayManager.getHolidays('FR', '13012', d.year());
        dates = new List<Date>(publicHolidays.keySet());
        return dates;
    }
}