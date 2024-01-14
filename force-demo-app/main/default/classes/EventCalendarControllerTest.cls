@IsTest
private class EventCalendarControllerTest {
    
    @IsTest
    private static void getPublicHolidays() {

        Date aDate = Date.newInstance(2018, 1, 1);

        
        Test.startTest();
        List<Date> publicHolidays = EventCalendarController.getPublicHolidays(aDate);
        Test.stopTest();
        
        Set<Date> publicHolidaysSet = new Set<Date>(publicHolidays);
        Assert.isTrue(publicHolidaysSet.contains(Date.newInstance(2018, 1, 1)), 'New Year\'s Day');
        Assert.isTrue(publicHolidaysSet.contains(Date.newInstance(2018, 5, 10)), 'Ascension Day');
        Assert.isTrue(publicHolidaysSet.contains(Date.newInstance(2018, 11, 1)), 'All Saint\'s Day');
    }
    
    @TestSetup
    private static void testSetup() {
        
    }
}