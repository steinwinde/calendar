@IsTest
private class PublicHolidayManagerTest {

    // TODO: make use of this for cross-checking
    private Map<Date, String> normalHolidays = new Map<Date, String> {
        // 2018
        d(2018, 1, 1) => 'Jour de l\'An',
        d(2018, 4, 2) => 'Lundi de Pâques',
        d(2018, 5, 1) => 'Fête du travail',
        d(2018, 5, 8) => 'Victoire 1945',
        d(2018, 5, 10) => 'Ascension',
        d(2018, 5, 21) => 'Pentecôte',
        d(2018, 7, 14) => 'Fête nationale',
        d(2018, 8, 15) => 'L\'Assomption',
        d(2018, 11, 1) => 'La Toussaint',
        d(2018, 11, 11) => 'Armistice',
        d(2018, 12, 25) => 'Jour de Noël',
        // 2019
        d(2019, 1, 1) => 'Jour de l\'An',
        d(2019, 4, 22) => 'Lundi de Pâques',
        d(2019, 5, 1) => 'Fête du travail',
        d(2019, 5, 8) => 'Victoire 1945',
        d(2019, 6, 30) => 'Ascension',
        d(2019, 6, 10) => 'Pentecôte',
        d(2019, 7, 14) => 'Fête nationale',
        d(2019, 8, 15) => 'L\'Assomption',
        d(2019, 11, 1) => 'La Toussaint',
        d(2019, 11, 11) => 'Armistice',
        d(2019, 12, 25) => 'Jour de Noël',
        // 2020
        d(2020, 1, 1) => 'Jour de l\'An',
        d(2020, 4, 13) => 'Lundi de Pâques',
        d(2020, 5, 1) => 'Fête du travail',
        d(2020, 5, 8) => 'Victoire 1945',
        d(2020, 5, 21) => 'Ascension',
        d(2020, 6, 1) => 'Pentecôte',
        d(2020, 7, 14) => 'Fête nationale',
        d(2020, 8, 15) => 'L\'Assomption',
        d(2020, 11, 1) => 'La Toussaint',
        d(2020, 11, 11) => 'Armistice',
        d(2020, 12, 25) => 'Jour de Noël'
    };

    private Map<Date, String> specialHolidays = new Map<Date, String> {
        // 2018
        d(2018, 3, 30) => 'Vendredi Saint',
        d(2018, 12, 26) => 'Jour de Saint Etienne',
        // 2019
        d(2019, 4, 19) => 'Vendredi Saint',
        d(2019, 12, 26) => 'Jour de Saint Etienne',
        // 2020
        d(2020, 4, 10) => 'Vendredi Saint',
        d(2020, 12, 26) => 'Jour de Saint Etienne'
    };


    @IsTest
    private static void testAll() {
        Map<Date, String> m = PublicHolidayManager.getHolidays('FR', '75001', 2019);
        System.assertEquals(11, m.size());
    }

    @IsTest
    private static void testEaster() {
        List<Integer> years = new List<Integer> {2018, 2019, 2020, 2021, 2022, 2023, 2024};
        for(Integer year: years) {
            Date easterMonday = PublicHolidayManager.getEasterMonday(year); 
            Date ascent = PublicHolidayManager.getAscent(year);
            Date pentecost = PublicHolidayManager.getPentecosteMonday(year);

            Map<Date, String> m = PublicHolidayManager.getHolidays('FR', '75020', year);
            
            Date d = getDate('Lundi de Pâques', m);
            System.assertEquals(easterMonday, d);

            d = getDate('Ascension', m);
            System.assertEquals(ascent, d);

            d = getDate('Pentecôte', m);
            System.assertEquals(pentecost, d);
        }
    }

    private static Date getDate(String s, Map<Date, String> date2Strings) {
        for(Date d:date2Strings.keySet()) {
            if(s == date2Strings.get(d)) return d;
        }
        return null;
    }

    private static Date d(Integer y, Integer m, Integer d) {
        return Date.newInstance(y, m, d);
    }
}