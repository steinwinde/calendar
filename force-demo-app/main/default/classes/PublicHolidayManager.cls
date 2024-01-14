global with sharing class PublicHolidayManager {
// @author Felix van Hove
// 
// According to French law...
// - public holidays depend on where one lives:
// Normally there are 11 days of holiday. People living in Alsace or Moselle
// have 2 more days of holiday. Alsace consists of two departments with a specific
// set of postal codes (Bas-Rhin, Haut-Rhin). Moselle represents another department,
// which has its set of postal code too.
// - most public holidays have a set date. The remaining can be calculated based on 
// the calculated date of Eastern.
// 
// TODO:
// THis should be made much faster, e.g. with the help of sorted keys:
// https://releasenotes.docs.salesforce.com/en-us/summer15/release-notes/rn_apex_maps_and_sets_iteration_order.htm
//
    public class UnsupportedCountryException extends Exception {}
	
    private static final Set<String> COUNTRIES = new Set<String> {'FR'};
    private static final Integer YEARS_AROUND = 10;
        
    private static final Map<String, Map<Date, String>> FR;
    
    static {
        // from: https://www.calendriergratuit.fr/jours-feries-2021.htm
        FR = new Map<String, Map<Date, String>> {
            // default French
            null => generateFrAll() ,
            // Alsace Moselle
            'AM' => generateFrAlsac()
        };
    }

    private static Map<Date, String> generateFrAll() {
        Map<Date, String> m = new Map<Date, String>();
        Date today = System.today();
        Integer fromYear = today.year()-YEARS_AROUND;
        Integer toYear = today.year()+YEARS_AROUND;
        for(Integer year=fromYear; year<=toYear; year++) {
            Date easterSunday = getEasterSunday(year);
            m.put(Date.newInstance(year, 1, 1), 'Jour de l\'An');
            m.put(getEasterMonday(easterSunday), 'Lundi de Pâques');
            m.put(Date.newInstance(year, 5, 1), 'Fête du travail');
            m.put(Date.newInstance(year, 5, 8), 'Victoire 1945');
            m.put(getAscent(easterSunday), 'Ascension');
            m.put(getPentecosteMonday(easterSunday), 'Pentecôte');
            m.put(Date.newInstance(year, 7, 14), 'Fête nationale');
            m.put(Date.newInstance(year, 8, 15), 'L\'Assomption');
            m.put(Date.newInstance(year, 11, 1), 'La Toussaint');
            m.put(Date.newInstance(year, 11, 11), 'Armistice');
            m.put(Date.newInstance(year, 12, 25), 'Jour de Noël');
        }
        return m;
    }
    
    private static Map<Date, String> generateFrAlsac() {
        Map<Date, String> m = new Map<Date, String>();
        Date today = System.today();
        Integer fromYear = today.year()-YEARS_AROUND;
        Integer toYear = today.year()+YEARS_AROUND;
        for(Integer year=fromYear; year<=toYear; year++) {
            m.put(Date.newInstance(year, 4, 15), 'Vendredi Saint');
            m.put(Date.newInstance(year, 1, 1), 'Jour de Saint Etienne');
        }
        return m;
    }
    
    public static Map<Date, String> getHolidays(String countryCode, String postalCode, Integer year) {
        Map<Date, String> m = getHolidays(countryCode, postalCode);
        Map<Date, String> result = new Map<Date, String>();
        for(Date d:m.keySet()) {
            if(d.year()==year) {
                result.put(d, m.get(d));
            }
        }
        return result;
    }

    public static List<Date> getHolidays(String countryCode, String postalCode, Date startDate, Date endDate) {
        Map<Date, String> m = getHolidays(countryCode, postalCode);
        List<Date> holidays = new List<Date>();
        for(Date d:m.keySet()) {
            if(startDate<=d && endDate>=d) holidays.add(d);
        }
        return holidays;
    }

    public static Boolean hasMoreFrenchHolidays(String postalCode) {
        // Heuristics: Postal codes starting with 67, 68 or 57 belong to Alsace-Moselle ("AM") and
        // have two more days of holiday.
        // See:
        // https://www.codepostal.org/region-alsace.html :
        // https://fr.wikipedia.org/wiki/Liste_des_communes_de_la_Moselle
        final String MOSELLE = '57';
        final String BAS_RHIN = '67';
        final String HAUT_RHIN = '68';
        
        if(!String.isBlank(postalCode) && postalCode.length()>=2) postalCode = postalCode.substring(0, 2);
        
        return postalCode == MOSELLE || postalCode == BAS_RHIN || postalCode == HAUT_RHIN;
    }
    
    public static Map<Date, String> getHolidays(String countryCode, String postalCode) {
        
        checkCountryCode(countryCode);
        
        if(hasMoreFrenchHolidays(postalCode)) {
            Map<Date, String> m = FR.get('AM');
            m.putAll(FR.get(null));
			return m;
        }
		return FR.get(null);
    }


    
    private static void checkCountryCode(String countryCode) {
        if(!COUNTRIES.contains(countryCode)) {
            throw new UnsupportedCountryException();
        }
    }
    
    private static Date d(Integer y, Integer m, Integer d) {
        return Date.newInstance(y, m, d);
    }
    


    // https://fr.wikipedia.org/wiki/Calcul_de_la_date_de_P%C3%A2ques
    public static Date getEasterSunday(Integer year) {
        // 1
        Integer n = Math.mod(year, 19);
        // 2
        Integer c = year/100;
        Integer u = Math.mod(year, 100);
        // 3 
        Integer s = c / 4;
        Integer t = Math.mod(c, 4);
        // 4
        Integer p = (c + 8) / 25;
        // 5
        Integer q = (c - p + 1) / 3;
        // 6
        Integer temp = (19*n) + c - s - q + 15;
        Integer e = Math.mod(temp, 30);
        // 7
        Integer b = u / 4;
        Integer d = Math.mod(u, 4);
        // 8
        temp = (2*t) + (2*b) - e - d + 32;
        Integer L = Math.mod(temp, 7);
        // 9
        temp = n + (11 * e) + (22 * L);
        Integer h = temp / 451;
        // 10
        temp = e + L - (7*h) + 114;
        Integer m = temp / 31;
        Integer j = Math.mod(temp, 31) + 1;

        Date result = Date.newInstance(year, m, j);
        return result;
    }

    public static Date getAscent(Integer year) {
        return getAscent(getEasterSunday(year));
    }

    public static Date getEasterMonday(Integer year) {
        return getEasterMonday(getEasterSunday(year));
    }

    public static Date getPentecosteSunday(Integer year) {
        return getPentecosteSunday(getEasterSunday(year));
    }

    public static Date getPentecosteMonday(Integer year) {
        return getPentecosteMonday(getEasterSunday(year));
    }

    public static Date getAscent(Date easterSunday) {
        return easterSunday.addDays(39);
    }

    public static Date getEasterMonday(Date easterSunday) {
        return easterSunday.addDays(1);
    }

    public static Date getPentecosteSunday(Date easterSunday) {
        return easterSunday.addDays(49);
    }

    public static Date getPentecosteMonday(Date easterSunday) {
        return easterSunday.addDays(50);
    }
}