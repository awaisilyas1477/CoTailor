// Pakistan Cities with Postal Codes and Provinces - Comprehensive List
const pakistanCities = [
    // Punjab - Major Cities
    { city: 'Lahore', postalCode: '54000', province: 'Punjab' },
    { city: 'Faisalabad', postalCode: '38000', province: 'Punjab' },
    { city: 'Rawalpindi', postalCode: '46000', province: 'Punjab' },
    { city: 'Multan', postalCode: '60000', province: 'Punjab' },
    { city: 'Gujranwala', postalCode: '52250', province: 'Punjab' },
    { city: 'Sialkot', postalCode: '51310', province: 'Punjab' },
    { city: 'Bahawalpur', postalCode: '63100', province: 'Punjab' },
    { city: 'Sargodha', postalCode: '40100', province: 'Punjab' },
    { city: 'Sheikhupura', postalCode: '39350', province: 'Punjab' },
    { city: 'Jhang', postalCode: '35200', province: 'Punjab' },
    { city: 'Rahim Yar Khan', postalCode: '64200', province: 'Punjab' },
    { city: 'Gujrat', postalCode: '50700', province: 'Punjab' },
    { city: 'Kasur', postalCode: '55050', province: 'Punjab' },
    { city: 'Chiniot', postalCode: '35400', province: 'Punjab' },
    { city: 'Khanpur', postalCode: '64100', province: 'Punjab' },
    { city: 'Hafizabad', postalCode: '52110', province: 'Punjab' },
    { city: 'Muzaffargarh', postalCode: '34200', province: 'Punjab' },
    { city: 'Khanewal', postalCode: '58150', province: 'Punjab' },
    { city: 'Gojra', postalCode: '36100', province: 'Punjab' },
    { city: 'Mandi Bahauddin', postalCode: '50400', province: 'Punjab' },
    { city: 'Jhelum', postalCode: '49600', province: 'Punjab' },
    { city: 'Shahkot', postalCode: '39500', province: 'Punjab' },
    { city: 'Kamalia', postalCode: '36300', province: 'Punjab' },
    { city: 'Ahmedpur East', postalCode: '63300', province: 'Punjab' },
    { city: 'Kot Addu', postalCode: '34000', province: 'Punjab' },
    { city: 'Wazirabad', postalCode: '52000', province: 'Punjab' },
    { city: 'Dera Ghazi Khan', postalCode: '32200', province: 'Punjab' },
    { city: 'Chakwal', postalCode: '48800', province: 'Punjab' },
    { city: 'Gujar Khan', postalCode: '47850', province: 'Punjab' },
    { city: 'Okara', postalCode: '56300', province: 'Punjab' },
    { city: 'Toba Tek Singh', postalCode: '36050', province: 'Punjab' },
    { city: 'Sahiwal', postalCode: '57000', province: 'Punjab' },
    { city: 'Pakpattan', postalCode: '57400', province: 'Punjab' },
    { city: 'Mianwali', postalCode: '42200', province: 'Punjab' },
    { city: 'Burewala', postalCode: '61000', province: 'Punjab' },
    { city: 'Layyah', postalCode: '31200', province: 'Punjab' },
    { city: 'Vehari', postalCode: '61100', province: 'Punjab' },
    { city: 'Narowal', postalCode: '51600', province: 'Punjab' },
    { city: 'Attock', postalCode: '43600', province: 'Punjab' },
    { city: 'Jaranwala', postalCode: '37250', province: 'Punjab' },
    { city: 'Daska', postalCode: '51010', province: 'Punjab' },
    { city: 'Kot Abdul Malik', postalCode: '39000', province: 'Punjab' },
    { city: 'Tandlianwala', postalCode: '37100', province: 'Punjab' },
    { city: 'Chishtian', postalCode: '62300', province: 'Punjab' },
    { city: 'Hasilpur', postalCode: '62100', province: 'Punjab' },
    { city: 'Arifwala', postalCode: '57400', province: 'Punjab' },
    { city: 'Bhakkar', postalCode: '30000', province: 'Punjab' },
    { city: 'Khushab', postalCode: '41000', province: 'Punjab' },
    { city: 'Mailsi', postalCode: '61200', province: 'Punjab' },
    { city: 'Lodhran', postalCode: '59320', province: 'Punjab' },
    { city: 'Khanewal', postalCode: '58150', province: 'Punjab' },
    { city: 'Dipalpur', postalCode: '56100', province: 'Punjab' },
    { city: 'Pattoki', postalCode: '55300', province: 'Punjab' },
    { city: 'Renala Khurd', postalCode: '56150', province: 'Punjab' },
    { city: 'Chunian', postalCode: '55200', province: 'Punjab' },
    { city: 'Nankana Sahib', postalCode: '39100', province: 'Punjab' },
    { city: 'Muridke', postalCode: '39050', province: 'Punjab' },
    { city: 'Sambrial', postalCode: '51050', province: 'Punjab' },
    { city: 'Pasrur', postalCode: '51400', province: 'Punjab' },
    { city: 'Zafarwal', postalCode: '51650', province: 'Punjab' },
    { city: 'Shakargarh', postalCode: '51620', province: 'Punjab' },
    { city: 'Phalia', postalCode: '50450', province: 'Punjab' },
    { city: 'Bhalwal', postalCode: '40400', province: 'Punjab' },
    { city: 'Sillanwali', postalCode: '40300', province: 'Punjab' },
    { city: 'Bhawana', postalCode: '35300', province: 'Punjab' },
    { city: 'Jauharabad', postalCode: '41200', province: 'Punjab' },
    { city: 'Kallar Kahar', postalCode: '48500', province: 'Punjab' },
    { city: 'Talagang', postalCode: '48100', province: 'Punjab' },
    { city: 'Pind Dadan Khan', postalCode: '49000', province: 'Punjab' },
    { city: 'Kharian', postalCode: '50600', province: 'Punjab' },
    { city: 'Lalamusa', postalCode: '50200', province: 'Punjab' },
    { city: 'Dinga', postalCode: '50100', province: 'Punjab' },
    { city: 'Kot Momin', postalCode: '40350', province: 'Punjab' },
    { city: 'Pir Mahal', postalCode: '36150', province: 'Punjab' },
    { city: 'Tulamba', postalCode: '36200', province: 'Punjab' },
    { city: 'Kabirwala', postalCode: '58250', province: 'Punjab' },
    { city: 'Mian Channu', postalCode: '58000', province: 'Punjab' },
    { city: 'Haroonabad', postalCode: '62150', province: 'Punjab' },
    { city: 'Fort Abbas', postalCode: '62000', province: 'Punjab' },
    { city: 'Minchinabad', postalCode: '62200', province: 'Punjab' },
    { city: 'Ahmadpur Sial', postalCode: '63200', province: 'Punjab' },
    { city: 'Liaquatpur', postalCode: '64000', province: 'Punjab' },
    { city: 'Rajanpur', postalCode: '32100', province: 'Punjab' },
    { city: 'Jampur', postalCode: '32000', province: 'Punjab' },
    { city: 'Dera Ismail Khan', postalCode: '29050', province: 'Khyber Pakhtunkhwa' },
    
    // Sindh - Major Cities
    { city: 'Karachi', postalCode: '75500', province: 'Sindh' },
    { city: 'Hyderabad', postalCode: '71000', province: 'Sindh' },
    { city: 'Sukkur', postalCode: '65200', province: 'Sindh' },
    { city: 'Larkana', postalCode: '77150', province: 'Sindh' },
    { city: 'Nawabshah', postalCode: '67450', province: 'Sindh' },
    { city: 'Kotri', postalCode: '76000', province: 'Sindh' },
    { city: 'Jacobabad', postalCode: '79000', province: 'Sindh' },
    { city: 'Shikarpur', postalCode: '78100', province: 'Sindh' },
    { city: 'Dadu', postalCode: '76200', province: 'Sindh' },
    { city: 'Tando Allahyar', postalCode: '70050', province: 'Sindh' },
    { city: 'Umerkot', postalCode: '69100', province: 'Sindh' },
    { city: 'Mirpur Khas', postalCode: '69000', province: 'Sindh' },
    { city: 'Thatta', postalCode: '73120', province: 'Sindh' },
    { city: 'Badin', postalCode: '72200', province: 'Sindh' },
    { city: 'Sanghar', postalCode: '68000', province: 'Sindh' },
    { city: 'Naushahro Feroze', postalCode: '67300', province: 'Sindh' },
    { city: 'Khairpur', postalCode: '66020', province: 'Sindh' },
    { city: 'Ghotki', postalCode: '65110', province: 'Sindh' },
    { city: 'Kashmore', postalCode: '79200', province: 'Sindh' },
    { city: 'Shikarpur', postalCode: '78100', province: 'Sindh' },
    { city: 'Lakhi', postalCode: '78000', province: 'Sindh' },
    { city: 'Kandhkot', postalCode: '79150', province: 'Sindh' },
    { city: 'Tando Muhammad Khan', postalCode: '70200', province: 'Sindh' },
    { city: 'Tando Jam', postalCode: '70060', province: 'Sindh' },
    { city: 'Hala', postalCode: '70130', province: 'Sindh' },
    { city: 'Matli', postalCode: '70070', province: 'Sindh' },
    { city: 'Tando Adam', postalCode: '70050', province: 'Sindh' },
    { city: 'Shahdadpur', postalCode: '68050', province: 'Sindh' },
    { city: 'Khipro', postalCode: '68020', province: 'Sindh' },
    { city: 'Sakrand', postalCode: '67200', province: 'Sindh' },
    { city: 'Moro', postalCode: '67350', province: 'Sindh' },
    { city: 'Kandiaro', postalCode: '67320', province: 'Sindh' },
    { city: 'Mehrabpur', postalCode: '67310', province: 'Sindh' },
    { city: 'Naushahro Feroze', postalCode: '67300', province: 'Sindh' },
    { city: 'Mithi', postalCode: '69200', province: 'Sindh' },
    { city: 'Daharki', postalCode: '65120', province: 'Sindh' },
    { city: 'Pano Aqil', postalCode: '65000', province: 'Sindh' },
    { city: 'Rohri', postalCode: '65130', province: 'Sindh' },
    { city: 'Khairpur Nathan Shah', postalCode: '76250', province: 'Sindh' },
    { city: 'Sehwan', postalCode: '76110', province: 'Sindh' },
    { city: 'Jamshoro', postalCode: '76080', province: 'Sindh' },
    { city: 'Kotri', postalCode: '76000', province: 'Sindh' },
    { city: 'Thano Bula Khan', postalCode: '76120', province: 'Sindh' },
    { city: 'Gambat', postalCode: '66030', province: 'Sindh' },
    { city: 'Pir Jo Goth', postalCode: '66040', province: 'Sindh' },
    { city: 'Sobho Dero', postalCode: '66050', province: 'Sindh' },
    { city: 'Kunri', postalCode: '69150', province: 'Sindh' },
    { city: 'Digri', postalCode: '69120', province: 'Sindh' },
    { city: 'Jhuddo', postalCode: '69130', province: 'Sindh' },
    { city: 'Samaro', postalCode: '69140', province: 'Sindh' },
    { city: 'Chhor', postalCode: '69250', province: 'Sindh' },
    { city: 'Islamkot', postalCode: '69230', province: 'Sindh' },
    { city: 'Nagarparkar', postalCode: '69240', province: 'Sindh' },
    { city: 'Chachro', postalCode: '69220', province: 'Sindh' },
    { city: 'Diplo', postalCode: '69210', province: 'Sindh' },
    { city: 'Talhar', postalCode: '72250', province: 'Sindh' },
    { city: 'Tando Bago', postalCode: '72220', province: 'Sindh' },
    { city: 'Golarchi', postalCode: '72210', province: 'Sindh' },
    { city: 'Tando Ghulam Ali', postalCode: '72230', province: 'Sindh' },
    { city: 'Khipro', postalCode: '68020', province: 'Sindh' },
    { city: 'Sanghar', postalCode: '68000', province: 'Sindh' },
    { city: 'Khipro', postalCode: '68020', province: 'Sindh' },
    
    // Khyber Pakhtunkhwa - Major Cities
    { city: 'Peshawar', postalCode: '25000', province: 'Khyber Pakhtunkhwa' },
    { city: 'Mardan', postalCode: '23200', province: 'Khyber Pakhtunkhwa' },
    { city: 'Mingora', postalCode: '19200', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kohat', postalCode: '26000', province: 'Khyber Pakhtunkhwa' },
    { city: 'Abbottabad', postalCode: '22010', province: 'Khyber Pakhtunkhwa' },
    { city: 'Haripur', postalCode: '22620', province: 'Khyber Pakhtunkhwa' },
    { city: 'Dera Ismail Khan', postalCode: '29050', province: 'Khyber Pakhtunkhwa' },
    { city: 'Bannu', postalCode: '28100', province: 'Khyber Pakhtunkhwa' },
    { city: 'Swabi', postalCode: '23430', province: 'Khyber Pakhtunkhwa' },
    { city: 'Charsadda', postalCode: '24420', province: 'Khyber Pakhtunkhwa' },
    { city: 'Nowshera', postalCode: '24100', province: 'Khyber Pakhtunkhwa' },
    { city: 'Mardan', postalCode: '23200', province: 'Khyber Pakhtunkhwa' },
    { city: 'Mansehra', postalCode: '21300', province: 'Khyber Pakhtunkhwa' },
    { city: 'Batkhela', postalCode: '23020', province: 'Khyber Pakhtunkhwa' },
    { city: 'Dargai', postalCode: '23030', province: 'Khyber Pakhtunkhwa' },
    { city: 'Malakand', postalCode: '23040', province: 'Khyber Pakhtunkhwa' },
    { city: 'Chitral', postalCode: '17200', province: 'Khyber Pakhtunkhwa' },
    { city: 'Dir', postalCode: '18000', province: 'Khyber Pakhtunkhwa' },
    { city: 'Timergara', postalCode: '18100', province: 'Khyber Pakhtunkhwa' },
    { city: 'Tank', postalCode: '29400', province: 'Khyber Pakhtunkhwa' },
    { city: 'Lakki Marwat', postalCode: '28420', province: 'Khyber Pakhtunkhwa' },
    { city: 'Hangu', postalCode: '26100', province: 'Khyber Pakhtunkhwa' },
    { city: 'Karak', postalCode: '27200', province: 'Khyber Pakhtunkhwa' },
    { city: 'Bannu', postalCode: '28100', province: 'Khyber Pakhtunkhwa' },
    { city: 'Dera Ismail Khan', postalCode: '29050', province: 'Khyber Pakhtunkhwa' },
    { city: 'Tangi', postalCode: '23440', province: 'Khyber Pakhtunkhwa' },
    { city: 'Topi', postalCode: '23450', province: 'Khyber Pakhtunkhwa' },
    { city: 'Jehangira', postalCode: '23460', province: 'Khyber Pakhtunkhwa' },
    { city: 'Risalpur', postalCode: '24080', province: 'Khyber Pakhtunkhwa' },
    { city: 'Pabbi', postalCode: '24070', province: 'Khyber Pakhtunkhwa' },
    { city: 'Akora Khattak', postalCode: '24060', province: 'Khyber Pakhtunkhwa' },
    { city: 'Shabqadar', postalCode: '24430', province: 'Khyber Pakhtunkhwa' },
    { city: 'Prang', postalCode: '24440', province: 'Khyber Pakhtunkhwa' },
    { city: 'Tang', postalCode: '24450', province: 'Khyber Pakhtunkhwa' },
    { city: 'Takht Bhai', postalCode: '23250', province: 'Khyber Pakhtunkhwa' },
    { city: 'Katlang', postalCode: '23260', province: 'Khyber Pakhtunkhwa' },
    { city: 'Rustam', postalCode: '23270', province: 'Khyber Pakhtunkhwa' },
    { city: 'Shergarh', postalCode: '23280', province: 'Khyber Pakhtunkhwa' },
    { city: 'Barikot', postalCode: '19250', province: 'Khyber Pakhtunkhwa' },
    { city: 'Khwazakhela', postalCode: '19260', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kabal', postalCode: '19270', province: 'Khyber Pakhtunkhwa' },
    { city: 'Matt', postalCode: '19280', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kalam', postalCode: '19230', province: 'Khyber Pakhtunkhwa' },
    { city: 'Madyan', postalCode: '19240', province: 'Khyber Pakhtunkhwa' },
    { city: 'Bahrain', postalCode: '19220', province: 'Khyber Pakhtunkhwa' },
    { city: 'Besham', postalCode: '19210', province: 'Khyber Pakhtunkhwa' },
    { city: 'Shangla', postalCode: '19100', province: 'Khyber Pakhtunkhwa' },
    { city: 'Alpuri', postalCode: '19150', province: 'Khyber Pakhtunkhwa' },
    { city: 'Buner', postalCode: '19290', province: 'Khyber Pakhtunkhwa' },
    { city: 'Daggar', postalCode: '19295', province: 'Khyber Pakhtunkhwa' },
    { city: 'Gaggo', postalCode: '19300', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kot', postalCode: '19310', province: 'Khyber Pakhtunkhwa' },
    { city: 'Pir Baba', postalCode: '19320', province: 'Khyber Pakhtunkhwa' },
    { city: 'Totalai', postalCode: '19330', province: 'Khyber Pakhtunkhwa' },
    { city: 'Chakdara', postalCode: '18800', province: 'Khyber Pakhtunkhwa' },
    { city: 'Batkhela', postalCode: '23020', province: 'Khyber Pakhtunkhwa' },
    { city: 'Dargai', postalCode: '23030', province: 'Khyber Pakhtunkhwa' },
    { city: 'Malakand', postalCode: '23040', province: 'Khyber Pakhtunkhwa' },
    { city: 'Thana', postalCode: '23050', province: 'Khyber Pakhtunkhwa' },
    { city: 'Amangarh', postalCode: '23060', province: 'Khyber Pakhtunkhwa' },
    { city: 'Dargai', postalCode: '23030', province: 'Khyber Pakhtunkhwa' },
    { city: 'Chitral', postalCode: '17200', province: 'Khyber Pakhtunkhwa' },
    { city: 'Mastuj', postalCode: '17210', province: 'Khyber Pakhtunkhwa' },
    { city: 'Booni', postalCode: '17220', province: 'Khyber Pakhtunkhwa' },
    { city: 'Dir', postalCode: '18000', province: 'Khyber Pakhtunkhwa' },
    { city: 'Timergara', postalCode: '18100', province: 'Khyber Pakhtunkhwa' },
    { city: 'Jandol', postalCode: '18150', province: 'Khyber Pakhtunkhwa' },
    { city: 'Adenzai', postalCode: '18160', province: 'Khyber Pakhtunkhwa' },
    { city: 'Samar Bagh', postalCode: '18170', province: 'Khyber Pakhtunkhwa' },
    { city: 'Lal Qilla', postalCode: '18180', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kalkot', postalCode: '18190', province: 'Khyber Pakhtunkhwa' },
    { city: 'Wari', postalCode: '18200', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kulachi', postalCode: '29300', province: 'Khyber Pakhtunkhwa' },
    { city: 'Dera Ismail Khan', postalCode: '29050', province: 'Khyber Pakhtunkhwa' },
    { city: 'Paroa', postalCode: '29060', province: 'Khyber Pakhtunkhwa' },
    { city: 'Paharpur', postalCode: '29070', province: 'Khyber Pakhtunkhwa' },
    { city: 'Daraban', postalCode: '29080', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kulachi', postalCode: '29300', province: 'Khyber Pakhtunkhwa' },
    { city: 'Tank', postalCode: '29400', province: 'Khyber Pakhtunkhwa' },
    { city: 'Jand', postalCode: '29410', province: 'Khyber Pakhtunkhwa' },
    { city: 'Lakki Marwat', postalCode: '28420', province: 'Khyber Pakhtunkhwa' },
    { city: 'Naurang', postalCode: '28430', province: 'Khyber Pakhtunkhwa' },
    { city: 'Sarai Naurang', postalCode: '28440', province: 'Khyber Pakhtunkhwa' },
    { city: 'Bannu', postalCode: '28100', province: 'Khyber Pakhtunkhwa' },
    { city: 'Domel', postalCode: '28110', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kakki', postalCode: '28120', province: 'Khyber Pakhtunkhwa' },
    { city: 'Mir Ali', postalCode: '28130', province: 'Khyber Pakhtunkhwa' },
    { city: 'Janikhel', postalCode: '28140', province: 'Khyber Pakhtunkhwa' },
    { city: 'Hangu', postalCode: '26100', province: 'Khyber Pakhtunkhwa' },
    { city: 'Tall', postalCode: '26110', province: 'Khyber Pakhtunkhwa' },
    { city: 'Karak', postalCode: '27200', province: 'Khyber Pakhtunkhwa' },
    { city: 'Banda Daud Shah', postalCode: '27210', province: 'Khyber Pakhtunkhwa' },
    { city: 'Takht-e-Nasrati', postalCode: '27220', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kohat', postalCode: '26000', province: 'Khyber Pakhtunkhwa' },
    { city: 'Lachi', postalCode: '26010', province: 'Khyber Pakhtunkhwa' },
    { city: 'Gumbat', postalCode: '26020', province: 'Khyber Pakhtunkhwa' },
    { city: 'Darra Adam Khel', postalCode: '26030', province: 'Khyber Pakhtunkhwa' },
    { city: 'Jarma', postalCode: '26040', province: 'Khyber Pakhtunkhwa' },
    { city: 'Togh', postalCode: '26050', province: 'Khyber Pakhtunkhwa' },
    { city: 'Abbottabad', postalCode: '22010', province: 'Khyber Pakhtunkhwa' },
    { city: 'Havelian', postalCode: '22020', province: 'Khyber Pakhtunkhwa' },
    { city: 'Nathia Gali', postalCode: '22030', province: 'Khyber Pakhtunkhwa' },
    { city: 'Murree', postalCode: '47150', province: 'Punjab' },
    { city: 'Mansehra', postalCode: '21300', province: 'Khyber Pakhtunkhwa' },
    { city: 'Baffa', postalCode: '21310', province: 'Khyber Pakhtunkhwa' },
    { city: 'Oghi', postalCode: '21320', province: 'Khyber Pakhtunkhwa' },
    { city: 'Balakot', postalCode: '21200', province: 'Khyber Pakhtunkhwa' },
    { city: 'Kaghan', postalCode: '21210', province: 'Khyber Pakhtunkhwa' },
    { city: 'Naran', postalCode: '21220', province: 'Khyber Pakhtunkhwa' },
    { city: 'Shogran', postalCode: '21230', province: 'Khyber Pakhtunkhwa' },
    { city: 'Haripur', postalCode: '22620', province: 'Khyber Pakhtunkhwa' },
    { city: 'Ghazi', postalCode: '22630', province: 'Khyber Pakhtunkhwa' },
    { city: 'Khanpur', postalCode: '22640', province: 'Khyber Pakhtunkhwa' },
    { city: 'Hattar', postalCode: '22650', province: 'Khyber Pakhtunkhwa' },
    
    // Balochistan - Major Cities
    { city: 'Quetta', postalCode: '87300', province: 'Balochistan' },
    { city: 'Turbat', postalCode: '92600', province: 'Balochistan' },
    { city: 'Khuzdar', postalCode: '89100', province: 'Balochistan' },
    { city: 'Chaman', postalCode: '86000', province: 'Balochistan' },
    { city: 'Zhob', postalCode: '85200', province: 'Balochistan' },
    { city: 'Gwadar', postalCode: '91200', province: 'Balochistan' },
    { city: 'Dera Murad Jamali', postalCode: '81100', province: 'Balochistan' },
    { city: 'Dera Allah Yar', postalCode: '81200', province: 'Balochistan' },
    { city: 'Usta Muhammad', postalCode: '81300', province: 'Balochistan' },
    { city: 'Sibi', postalCode: '82000', province: 'Balochistan' },
    { city: 'Loralai', postalCode: '84800', province: 'Balochistan' },
    { city: 'Barkhan', postalCode: '84400', province: 'Balochistan' },
    { city: 'Musakhel', postalCode: '84500', province: 'Balochistan' },
    { city: 'Zhob', postalCode: '85200', province: 'Balochistan' },
    { city: 'Qila Saifullah', postalCode: '85300', province: 'Balochistan' },
    { city: 'Sherani', postalCode: '85400', province: 'Balochistan' },
    { city: 'Killa Abdullah', postalCode: '86100', province: 'Balochistan' },
    { city: 'Pishin', postalCode: '86200', province: 'Balochistan' },
    { city: 'Qila Abdullah', postalCode: '86300', province: 'Balochistan' },
    { city: 'Chaman', postalCode: '86000', province: 'Balochistan' },
    { city: 'Nushki', postalCode: '87100', province: 'Balochistan' },
    { city: 'Chagai', postalCode: '87200', province: 'Balochistan' },
    { city: 'Quetta', postalCode: '87300', province: 'Balochistan' },
    { city: 'Pishin', postalCode: '86200', province: 'Balochistan' },
    { city: 'Kuchlak', postalCode: '87310', province: 'Balochistan' },
    { city: 'Mastung', postalCode: '88100', province: 'Balochistan' },
    { city: 'Kalat', postalCode: '88300', province: 'Balochistan' },
    { city: 'Khuzdar', postalCode: '89100', province: 'Balochistan' },
    { city: 'Lasbela', postalCode: '90100', province: 'Balochistan' },
    { city: 'Uthal', postalCode: '90150', province: 'Balochistan' },
    { city: 'Bela', postalCode: '90200', province: 'Balochistan' },
    { city: 'Gwadar', postalCode: '91200', province: 'Balochistan' },
    { city: 'Pasni', postalCode: '91300', province: 'Balochistan' },
    { city: 'Ormara', postalCode: '91400', province: 'Balochistan' },
    { city: 'Turbat', postalCode: '92600', province: 'Balochistan' },
    { city: 'Panjgur', postalCode: '92700', province: 'Balochistan' },
    { city: 'Kech', postalCode: '92800', province: 'Balochistan' },
    { city: 'Awaran', postalCode: '92900', province: 'Balochistan' },
    { city: 'Jhal Magsi', postalCode: '81150', province: 'Balochistan' },
    { city: 'Jaffarabad', postalCode: '81250', province: 'Balochistan' },
    { city: 'Nasirabad', postalCode: '81350', province: 'Balochistan' },
    { city: 'Kachhi', postalCode: '81400', province: 'Balochistan' },
    { city: 'Bolan', postalCode: '82100', province: 'Balochistan' },
    { city: 'Harnai', postalCode: '82200', province: 'Balochistan' },
    { city: 'Ziarat', postalCode: '82300', province: 'Balochistan' },
    { city: 'Kohlu', postalCode: '82400', province: 'Balochistan' },
    { city: 'Dera Bugti', postalCode: '82500', province: 'Balochistan' },
    { city: 'Barkhan', postalCode: '84400', province: 'Balochistan' },
    { city: 'Musakhel', postalCode: '84500', province: 'Balochistan' },
    { city: 'Loralai', postalCode: '84800', province: 'Balochistan' },
    { city: 'Duki', postalCode: '84900', province: 'Balochistan' },
    { city: 'Ziarat', postalCode: '82300', province: 'Balochistan' },
    { city: 'Sanjawi', postalCode: '82350', province: 'Balochistan' },
    { city: 'Harnai', postalCode: '82200', province: 'Balochistan' },
    { city: 'Sharigh', postalCode: '82250', province: 'Balochistan' },
    { city: 'Kohlu', postalCode: '82400', province: 'Balochistan' },
    { city: 'Dera Bugti', postalCode: '82500', province: 'Balochistan' },
    { city: 'Sui', postalCode: '82550', province: 'Balochistan' },
    { city: 'Pir Koh', postalCode: '82600', province: 'Balochistan' },
    
    // Islamabad Capital Territory
    { city: 'Islamabad', postalCode: '44000', province: 'Islamabad Capital Territory' },
    { city: 'Rawalpindi', postalCode: '46000', province: 'Punjab' }
];

// Populate city dropdown
function populateCityDropdown() {
    const citySelect = document.getElementById('city');
    if (!citySelect) return;
    
    // Sort cities alphabetically
    const sortedCities = [...pakistanCities].sort((a, b) => a.city.localeCompare(b.city));
    
    sortedCities.forEach(cityData => {
        const option = document.createElement('option');
        option.value = cityData.city;
        option.textContent = cityData.city;
        option.setAttribute('data-postal', cityData.postalCode);
        option.setAttribute('data-province', cityData.province);
        citySelect.appendChild(option);
    });
}

// Update postal code and province when city is selected
function setupCityChangeHandler() {
    const citySelect = document.getElementById('city');
    const postalCodeInput = document.getElementById('postalCode');
    const stateInput = document.getElementById('state');
    
    if (citySelect && postalCodeInput && stateInput) {
        citySelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            
            if (selectedOption.value) {
                const postalCode = selectedOption.getAttribute('data-postal');
                const province = selectedOption.getAttribute('data-province');
                
                postalCodeInput.value = postalCode;
                stateInput.value = province;
            } else {
                postalCodeInput.value = '';
                stateInput.value = '';
            }
        });
    }
}

// Update badge counter and header IMMEDIATELY on page load (before order summary loads)
// This ensures the header shows the correct value instantly
(function() {
    // Check badge value first (most reliable - already updated from cart)
    const badge = document.getElementById("badge");
    if (badge && badge.textContent && badge.textContent !== '0' && badge.textContent.trim() !== '') {
        const badgeValue = badge.textContent.trim();
        const totalItemHeader = document.getElementById('totalItem');
        if (totalItemHeader) {
            totalItemHeader.textContent = `Total Items: ${badgeValue}`;
        }
    }
    
    // Also check cookies as fallback
    if(document.cookie && document.cookie.indexOf(',counter=')>=0) {
        try {
            let counter = document.cookie.split(',')[1].split('=')[1];
            if (badge) badge.innerHTML = counter;
            
            // Update header if badge didn't have a value
            const totalItemHeader = document.getElementById('totalItem');
            if (totalItemHeader && (!badge || badge.textContent === '0' || badge.textContent.trim() === '')) {
                totalItemHeader.textContent = `Total Items: ${counter}`;
            }
        } catch (error) {
            // Ignore cookie parsing errors
        }
    }
})();

// Initialize city dropdown and handlers
populateCityDropdown();
setupCityChangeHandler();

// Supabase Configuration (Moved to top to be available everywhere)
const SUPABASE_BASE_URL = "https://grksptxhbdlbdrlabaew.supabase.co/rest/v1";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdya3NwdHhoYmRsYmRybGFiYWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcyOTI2MDgsImV4cCI6MjA4Mjg2ODYwOH0.TpiilrTDb4ZNbETvl0h4E_LFHZGpcx91_6Nx_dDPbew";

// Supabase API endpoint for products
const PRODUCTS_API = `${SUPABASE_BASE_URL}/products?select=*`;

// Prevent multiple simultaneous calls
let orderSummaryInitialized = false;
let orderSummaryInProgress = false;

// Load order summary - OPTIMISTIC with instant hydration
async function loadOrderSummary() {
    // Always use legacy method for order summary since optimistic cart doesn't update order summary properly
    // The optimistic cart updates cart UI but not order summary, so we need the legacy method
    await loadOrderSummaryLegacy();
}

// Legacy order summary loading (fallback)
async function loadOrderSummaryLegacy() {
    const summaryContent = document.getElementById('summaryContent');
    const summarySkeleton = document.getElementById('summarySkeleton');
    if (!summaryContent) return;
    
    // Prevent multiple simultaneous calls
    if (orderSummaryInProgress) {
        return;
    }
    orderSummaryInProgress = true;
    
    // Check if items already exist in DOM - if so, don't clear them unless explicitly needed
    const existingItems = summaryContent.querySelectorAll('.summary-items, .summary-total');
    const hasExistingItems = existingItems.length > 0;
    
    // Only show skeleton if no items exist yet
    if (!hasExistingItems && summarySkeleton) {
        summarySkeleton.style.display = 'block';
    }
    
    let cartItems = null;
    let itemCount = {};
    let totalCounter = 0;
    
    // ============================================
    // SEPARATE LOGIC: Check if user is logged in
    // ============================================
    let isLoggedIn = false;
    try {
        if (window.auth && typeof window.auth.getCurrentUser === 'function') {
            const { user } = await window.auth.getCurrentUser();
            isLoggedIn = !!user;
        }
    } catch (error) {
        isLoggedIn = false;
    }
    
    // ============================================
    // FLOW 1: LOGGED-IN USER (State/Cache/Cookies)
    // ============================================
    if (isLoggedIn) {
        // STEP 1: Check state manager FIRST (most reliable - always has latest optimistic updates)
        if (window.stateManager) {
            try {
                const state = window.stateManager.getState();
                if (state.cart && state.cart.length > 0) {
                    cartItems = state.cart;
                    state.cart.forEach(item => {
                        const productId = item.product_id;
                        const quantity = item.quantity || 1;
                        itemCount[productId] = (itemCount[productId] || 0) + quantity;
                        totalCounter += quantity;
                    });
                    const totalItemHeader = document.getElementById('totalItem');
                    if (totalItemHeader) {
                        totalItemHeader.textContent = `Total Items: ${totalCounter}`;
                    }
                }
            } catch (error) {
                // Ignore errors
            }
        }
        
        // STEP 2: Check localStorage cache (fallback if state manager is empty)
        if ((!cartItems || cartItems.length === 0) && window.userCart && typeof window.userCart.getCachedCart === 'function') {
            try {
                const cached = window.userCart.getCachedCart();
                if (cached && cached.length > 0) {
                    cartItems = cached;
                    cached.forEach(item => {
                        const productId = item.product_id;
                        const quantity = item.quantity || 1;
                        itemCount[productId] = (itemCount[productId] || 0) + quantity;
                        totalCounter += quantity;
                    });
                    const totalItemHeader = document.getElementById('totalItem');
                    if (totalItemHeader) {
                        totalItemHeader.textContent = `Total Items: ${totalCounter}`;
                    }
                }
            } catch (error) {
                // Ignore errors
            }
        }
        
        // STEP 3: Check cookies as fallback (for logged-in users who might have items in cookies)
        if ((!cartItems || cartItems.length === 0) && document.cookie && document.cookie.indexOf(',counter=') >= 0) {
            try {
                let items = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
                let counter = Number(document.cookie.split(',')[1].split('=')[1]);
                
                // Count items from cookies
                items.forEach(id => {
                    if (id && id.trim() !== '') {
                        itemCount[id] = (itemCount[id] || 0) + 1;
                        totalCounter++;
                    }
                });
                
                // Update header immediately when items found from cookies
                const totalItemHeader = document.getElementById('totalItem');
                if (totalItemHeader) {
                    totalItemHeader.textContent = `Total Items: ${totalCounter}`;
                }
                
                // Mark that we have cookie items (empty array signals cookie-based cart)
                cartItems = [];
            } catch (error) {
                // Ignore cookie errors
            }
        }
    }
    // ============================================
    // FLOW 2: GUEST USER (Cookies Only)
    // ============================================
    else {
        // For guest users, ONLY use cookies (no database/state/cache)
        if (document.cookie && document.cookie.indexOf(',counter=') >= 0) {
            try {
                let items = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
                let counter = Number(document.cookie.split(',')[1].split('=')[1]);
                
                // Count items from cookies
                items.forEach(id => {
                    if (id && id.trim() !== '') {
                        itemCount[id] = (itemCount[id] || 0) + 1;
                        totalCounter++;
                    }
                });
                
                // Update header immediately when items found from cookies
                const totalItemHeader = document.getElementById('totalItem');
                if (totalItemHeader) {
                    totalItemHeader.textContent = `Total Items: ${totalCounter}`;
                }
                
                // Mark that we have cookie items (empty array signals cookie-based cart)
                cartItems = [];
            } catch (error) {
                // Ignore cookie errors
            }
        }
    }
    
    // STEP 3: If no items found, check badge as fallback before showing empty
    if (Object.keys(itemCount).length === 0) {
        // LAST RESORT: Check badge value (might have items but not synced to state/cache yet)
        const badge = document.getElementById("badge");
        if (badge && badge.textContent && badge.textContent !== '0' && badge.textContent.trim() !== '') {
            const badgeValue = parseInt(badge.textContent.trim(), 10);
            if (!isNaN(badgeValue) && badgeValue > 0) {
                // Badge has a value - update header but don't render summary yet
                // The summary will be rendered when products are fetched
                const totalItemHeader = document.getElementById('totalItem');
                if (totalItemHeader) {
                    totalItemHeader.textContent = `Total Items: ${badgeValue}`;
                }
                // Don't show empty message - continue to STEP 4 to fetch products and build summary
                // We'll use cookies/state to build the summary when products are available
            }
        }
        
        // If badge is also 0 or empty, show empty message
        const badgeValue = badge ? parseInt(badge.textContent.trim(), 10) : 0;
        if (isNaN(badgeValue) || badgeValue === 0) {
            // IMPORTANT: Don't clear existing items if they already exist in DOM
            // This prevents clearing items that were just loaded
            if (!hasExistingItems) {
                // Hide skeleton and show empty message
                if (summarySkeleton) {
                    summarySkeleton.style.display = 'none';
                }
                // Clear existing content (except skeleton) and add message
                const existingContent = summaryContent.querySelectorAll('.summary-items, .summary-total, p:not(#summarySkeleton p)');
                existingContent.forEach(el => el.remove());
                summaryContent.insertAdjacentHTML('beforeend', '<p>No items in cart.</p>');
                // Update total items header ONLY if no items exist in DOM
                const totalItemHeader = document.getElementById('totalItem');
                if (totalItemHeader) {
                    totalItemHeader.textContent = 'Total Items: 0';
                }
            } else {
                // Items exist in DOM but not in cache - extract count from existing DOM
                // Don't clear items or update header to 0 - keep existing values
                const totalItemHeader = document.getElementById('totalItem');
                if (totalItemHeader) {
                    // Try to extract count from existing summary content
                    // The structure is: .summary-total > .total-row:first-child > span:last-child
                    const existingTotalRows = summaryContent.querySelectorAll('.summary-total .total-row');
                    if (existingTotalRows.length > 0) {
                        // First total-row should contain "Total Items"
                        const firstRow = existingTotalRows[0];
                        const spans = firstRow.querySelectorAll('span');
                        if (spans.length >= 2) {
                            // Second span contains the count
                            const countSpan = spans[1];
                            if (countSpan && countSpan.textContent) {
                                const count = countSpan.textContent.trim();
                                totalItemHeader.textContent = `Total Items: ${count}`;
                            }
                        }
                    }
                    // If we can't extract, don't update (keep existing value - don't set to 0)
                }
            }
            orderSummaryInProgress = false;
            return;
        }
    }

    // STEP 5: Fetch products and build summary
    const SUPABASE_URL = `${SUPABASE_BASE_URL}/products?select=*`;
    let httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', SUPABASE_URL, true);
    httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
    
    // Store totalCounter in a way that the callback can access it correctly
    const finalTotalCounter = totalCounter;
    
    httpRequest.onreadystatechange = function() {
        if(this.readyState === 4 && this.status == 200) {
            try {
                let allProducts = JSON.parse(this.responseText);
                
                let totalAmount = 0;
                const deliveryCharges = 200;
                
                // IMPORTANT: If itemCount is empty, try to get items from localStorage/state manager/cookies again
                // This handles the case where items weren't found in the initial check but exist
                if (Object.keys(itemCount).length === 0) {
                    // Try state manager
                    if (window.stateManager) {
                        try {
                            const state = window.stateManager.getState();
                            if (state.cart && state.cart.length > 0) {
                                state.cart.forEach(item => {
                                    const productId = item.product_id;
                                    const quantity = item.quantity || 1;
                                    itemCount[productId] = (itemCount[productId] || 0) + quantity;
                                });
                            }
                        } catch (error) {
                            // Ignore errors
                        }
                    }
                    
                    // Try localStorage cache
                    if (Object.keys(itemCount).length === 0 && window.userCart && typeof window.userCart.getCachedCart === 'function') {
                        try {
                            const cached = window.userCart.getCachedCart();
                            if (cached && cached.length > 0) {
                                cached.forEach(item => {
                                    const productId = item.product_id;
                                    const quantity = item.quantity || 1;
                                    itemCount[productId] = (itemCount[productId] || 0) + quantity;
                                });
                            }
                        } catch (error) {
                            // Ignore errors
                        }
                    }
                    
                    // Try cookies
                    if (Object.keys(itemCount).length === 0 && document.cookie && document.cookie.indexOf(',counter=') >= 0) {
                        try {
                            let items = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
                            items.forEach(id => {
                                if (id && id.trim() !== '') {
                                    itemCount[id] = (itemCount[id] || 0) + 1;
                                }
                            });
                        } catch (error) {
                            // Ignore cookie errors
                        }
                    }
                }
                
                // Recalculate totalCounter from itemCount to ensure we have the correct count
                let recalculatedCounter = 0;
                Object.keys(itemCount).forEach(itemId => {
                    recalculatedCounter += itemCount[itemId];
                });
                
                // Use recalculated counter or fallback to finalTotalCounter
                const displayCounter = recalculatedCounter > 0 ? recalculatedCounter : finalTotalCounter;

                let summaryHTML = '<div class="summary-items">';
                
                // Build summary only if we have items
                if (Object.keys(itemCount).length > 0) {
                    Object.keys(itemCount).forEach(itemId => {
                        const itemIdNum = Number(itemId);
                        // Find product by ID
                        const product = allProducts.find(p => p.id === itemIdNum);
                        if (product) {
                            const quantity = itemCount[itemId];
                            const price = Math.round(Number(product.final_price || product.price || 0));
                            const itemTotal = Math.round(price * quantity);
                            totalAmount += itemTotal;
                            
                            // Get variant information from cartItems if available
                            let variantText = '';
                            if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
                                // Find all cart items with this product ID (may have multiple variants)
                                const matchingItems = cartItems.filter(item => item.product_id === itemIdNum);
                                if (matchingItems.length > 0) {
                                    // If multiple variants, show all of them
                                    const variantParts = [];
                                    matchingItems.forEach(item => {
                                        if (item.size_name || item.color_name) {
                                            const parts = [];
                                            if (item.size_name) parts.push(`Size: ${item.size_name}`);
                                            if (item.color_name) parts.push(`Color: ${item.color_name}`);
                                            const variantStr = parts.join(' | ');
                                            if (variantStr) {
                                                variantParts.push(`${variantStr} (×${item.quantity || 1})`);
                                            }
                                        }
                                    });
                                    if (variantParts.length > 0) {
                                        variantText = variantParts.join(', ');
                                    }
                                }
                            }
                            
                            // Build item name with variant info
                            let itemNameHTML = `${product.name} × ${quantity}`;
                            if (variantText) {
                                itemNameHTML += `<br><span style="font-size: 0.85em; color: #666; font-weight: normal;">${variantText}</span>`;
                            }
                            
                            summaryHTML += `
                                <div class="summary-item">
                                    <span class="item-name">${itemNameHTML}</span>
                                    <span class="item-price">Rs ${itemTotal}</span>
                                </div>
                            `;
                        }
                    });
                } else {
                    // No items found - show empty message
                    summaryHTML += '<p>No items in cart.</p>';
                }
                
                const finalTotal = Math.round(totalAmount + deliveryCharges);
                
                summaryHTML += '</div>';
                summaryHTML += `
                    <div class="summary-total">
                        <div class="total-row">
                            <span>Total Items:</span>
                            <span>${displayCounter}</span>
                        </div>
                        <div class="total-row">
                            <span>Subtotal:</span>
                            <span>Rs ${totalAmount}</span>
                        </div>
                        <div class="total-row">
                            <span>Delivery Charges:</span>
                            <span>Rs ${deliveryCharges}</span>
                        </div>
                        <div class="total-row final-total-row">
                            <span>Total Amount:</span>
                            <span class="total-amount">Rs ${finalTotal}</span>
                        </div>
                    </div>
                `;
                
                // Hide skeleton and show content immediately when data is ready
                if (summarySkeleton) {
                    summarySkeleton.style.display = 'none';
                }
                // Clear existing content (except skeleton) and add new content
                const existingItems = summaryContent.querySelectorAll('.summary-items, .summary-total, p:not(#summarySkeleton p)');
                existingItems.forEach(el => el.remove());
                summaryContent.insertAdjacentHTML('beforeend', summaryHTML);
                
                // Update total items header - use recalculated counter
                const totalItemHeader = document.getElementById('totalItem');
                if (totalItemHeader) {
                    totalItemHeader.textContent = `Total Items: ${displayCounter}`;
                }
                
                orderSummaryInProgress = false;
            } catch (error) {
                if (summarySkeleton) {
                    summarySkeleton.style.display = 'none';
                }
                // Only clear content if no items exist (don't clear existing items on error)
                const stillHasItems = summaryContent.querySelectorAll('.summary-items, .summary-total').length > 0;
                if (!stillHasItems) {
                    const existingContent = summaryContent.querySelectorAll(':not(#summarySkeleton)');
                    existingContent.forEach(el => el.remove());
                    summaryContent.insertAdjacentHTML('beforeend', '<p>Error loading order summary.</p>');
                }
                orderSummaryInProgress = false;
            }
        } else if (this.readyState === 4 && this.status !== 200) {
            if (summarySkeleton) {
                summarySkeleton.style.display = 'none';
            }
            // Only clear content if no items exist (don't clear existing items on error)
            const stillHasItems = summaryContent.querySelectorAll('.summary-items, .summary-total').length > 0;
            if (!stillHasItems) {
                const existingContent = summaryContent.querySelectorAll(':not(#summarySkeleton)');
                existingContent.forEach(el => el.remove());
                summaryContent.insertAdjacentHTML('beforeend', '<p>Error loading order summary.</p>');
            }
            orderSummaryInProgress = false;
        }
    };
    
    httpRequest.send();
}

// Show loading state on submit button
function showSubmitLoader() {
    const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing Order...';
    }
}

// Hide loading state on submit button
function hideSubmitLoader() {
    const submitBtn = document.querySelector('#checkoutForm button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Place Order';
    }
}

// Show error message
function showSubmitError(message) {
    const form = document.getElementById('checkoutForm');
    let errorDiv = document.getElementById('submitError');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'submitError';
        errorDiv.style.cssText = 'background-color: #fee; color: #c33; padding: 12px; border-radius: 4px; margin-bottom: 20px; border: 1px solid #fcc;';
        form.insertBefore(errorDiv, form.firstChild);
    }
    
    errorDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> ' + message;
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Remove error message
function removeSubmitError() {
    const errorDiv = document.getElementById('submitError');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Validate Pakistan phone number
function validatePakistanPhone(phone) {
    // Remove spaces, dashes, and other characters
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // Since +92 is always prefixed, we just need 10 digits
    if (cleaned.length === 10 && /^[0-9]{10}$/.test(cleaned)) {
        return true;
    }
    
    // Also support old format (starting with 0)
    if (cleaned.startsWith('0') && cleaned.length === 11) {
        return /^0[0-9]{10}$/.test(cleaned);
    }
    
    return false;
}

// Get full phone number with country code
function getFullPhoneNumber(phoneInput) {
    const value = phoneInput.value.replace(/[^\d]/g, '');
    // If it starts with 0, remove it and add +92
    if (value.startsWith('0')) {
        return '+92' + value.substring(1);
    }
    // Otherwise, just add +92 prefix
    return '+92' + value;
}

// Format phone number as user types
function formatPhoneNumber(input) {
    // Remove all non-digits
    let value = input.value.replace(/[^\d]/g, '');
    
    // If user types 0 at start, remove it (since +92 is already shown)
    if (value.startsWith('0')) {
        value = value.substring(1);
    }
    
    // Limit to 10 digits (Pakistan phone number without country code)
    if (value.length > 10) {
        value = value.substring(0, 10);
    }
    
    input.value = value;
    
    // Validate and show error
    const phoneError = document.getElementById('phoneError');
    if (value && !validatePakistanPhone(value)) {
        if (phoneError) {
            phoneError.textContent = 'Please enter a valid 10-digit phone number (e.g., 3034651965)';
            phoneError.style.display = 'block';
        }
        input.setCustomValidity('Please enter a valid 10-digit phone number');
    } else {
        if (phoneError) {
            phoneError.style.display = 'none';
        }
        input.setCustomValidity('');
    }
}

// Form submission - ensure form exists before adding listener
let formSubmissionInitialized = false;
let isSubmitting = false; // Flag to prevent double submission

function initFormSubmission() {
    // Prevent multiple initializations
    if (formSubmissionInitialized) {
        return;
    }
    
    const checkoutForm = document.getElementById('checkoutForm');
    if (!checkoutForm) {
        // Retry if form not loaded yet
        setTimeout(initFormSubmission, 100);
        return;
    }
    
    // Mark as initialized to prevent duplicate listeners
    formSubmissionInitialized = true;
    
    // Saved addresses are initialized in initCheckoutPage() - no need to initialize again
    
    // Add phone number validation on input
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
        
        phoneInput.addEventListener('blur', function() {
            formatPhoneNumber(this);
        });
        
        // Reset border color on focus
        phoneInput.addEventListener('focus', function() {
            const wrapper = this.closest('.phone-input-wrapper');
            if (wrapper) {
                wrapper.style.borderColor = '';
            }
        });
    }
    
    checkoutForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
        return;
    }
    
    // Set flag to prevent duplicate submissions
    isSubmitting = true;
    
    // Remove any previous errors
    removeSubmitError();
    
    // Get form values
    const fullName = document.getElementById('fullName').value.trim();
    const phoneInput = document.getElementById('phone');
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = document.getElementById('email').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const postalCode = document.getElementById('postalCode').value.trim();
    const province = document.getElementById('state').value.trim();
    
    // Validate required fields
    if (!fullName || !phone || !address || !city || !province) {
        showSubmitError('Please fill in all required fields.');
        isSubmitting = false; // Reset flag on validation error
        return;
    }
    
    // Validate Pakistan phone number
    if (!validatePakistanPhone(phone)) {
        showSubmitError('Please enter a valid 10-digit phone number (e.g., 3034651965)');
        isSubmitting = false;
        // Highlight phone field
        if (phoneInput) {
            phoneInput.focus();
            const wrapper = phoneInput.closest('.phone-input-wrapper');
            if (wrapper) {
                wrapper.style.borderColor = '#c33';
            }
        }
        return;
    }
    
    // Get full phone number with +92 prefix
    const fullPhoneNumber = getFullPhoneNumber(phoneInput);
    
    // Show loader
    showSubmitLoader();
    
    // Store form data in sessionStorage (for order placed page)
    const formData = {
        fullName: fullName,
        phone: phone,
        email: email,
        address: address,
        city: city,
        postalCode: postalCode,
        state: province,
        paymentMethod: 'Cash on Delivery'
    };
    sessionStorage.setItem('orderDetails', JSON.stringify(formData));
    
    // Get cart items - check state manager, localStorage, and cookies (same logic as order summary)
    let cartItems = null;
    let itemCount = {};
    let totalCounter = 0;
    
    // Check if user is logged in
    let isLoggedIn = false;
    try {
        if (window.auth && typeof window.auth.getCurrentUser === 'function') {
            const { user } = await window.auth.getCurrentUser();
            isLoggedIn = !!user;
        }
    } catch (error) {
        isLoggedIn = false;
    }
    
    // FLOW 1: LOGGED-IN USER (State/Cache)
    if (isLoggedIn) {
        // STEP 1: Check state manager FIRST
        if (window.stateManager) {
            try {
                const state = window.stateManager.getState();
                if (state.cart && state.cart.length > 0) {
                    cartItems = state.cart;
                    state.cart.forEach(item => {
                        const productId = item.product_id;
                        const quantity = item.quantity || 1;
                        itemCount[productId] = (itemCount[productId] || 0) + quantity;
                        totalCounter += quantity;
                    });
                }
            } catch (error) {
                // Ignore errors
            }
        }
        
        // STEP 2: Check localStorage cache (fallback if state manager is empty)
        if ((!cartItems || cartItems.length === 0) && window.userCart && typeof window.userCart.getCachedCart === 'function') {
            try {
                const cached = window.userCart.getCachedCart();
                if (cached && cached.length > 0) {
                    cartItems = cached;
                    cached.forEach(item => {
                        const productId = item.product_id;
                        const quantity = item.quantity || 1;
                        itemCount[productId] = (itemCount[productId] || 0) + quantity;
                        totalCounter += quantity;
                    });
                }
            } catch (error) {
                // Ignore errors
            }
        }
    }
    
    // FLOW 2: GUEST USER or FALLBACK (Cookies)
    if ((!cartItems || cartItems.length === 0) && document.cookie && document.cookie.indexOf(',counter=') >= 0) {
        try {
            let items = document.cookie.split(',')[0].split('=')[1].split(" ").filter(id => id.trim() !== '');
            let counter = Number(document.cookie.split(',')[1].split('=')[1]);
            
            // Count items from cookies
            items.forEach(id => {
                if (id && id.trim() !== '') {
                    itemCount[id] = (itemCount[id] || 0) + 1;
                    totalCounter++;
                }
            });
            
            // Mark that we have cookie items (empty array signals cookie-based cart)
            cartItems = [];
        } catch (error) {
            // Ignore cookie errors
        }
    }
    
    // Validate that we have items
    if (Object.keys(itemCount).length === 0 || totalCounter === 0) {
        hideSubmitLoader();
        showSubmitError('Your cart is empty. Please add items to cart first.');
        isSubmitting = false;
        return;
    }
    
    // Fetch product details to calculate totals and get product info
    const productsRequest = new XMLHttpRequest();
    productsRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            if (this.status === 200) {
                try {
                    let allProducts = JSON.parse(this.responseText);
                    
                    // Calculate totals
                    let subtotal = 0;
                    const deliveryCharges = 200;
                    let orderItemsData = [];
                    
                    // Prepare order items data
                    // If we have cartItems from state manager/localStorage, use them directly
                    if (cartItems && Array.isArray(cartItems) && cartItems.length > 0) {
                        // Use cartItems directly - they already have all the info we need
                        cartItems.forEach(cartItem => {
                            const productId = cartItem.product_id;
                            const product = allProducts.find(p => p.id === productId);
                            
                            if (product) {
                                const quantity = cartItem.quantity || 1;
                                const roundedPrice = Math.round(Number(product.final_price || product.price || 0));
                                const itemTotal = Math.round(roundedPrice * quantity);
                                subtotal = Math.round(subtotal + itemTotal);
                                
                                orderItemsData.push({
                                    product_id: null, // MockAPI IDs are not UUIDs, so set to null
                                    product_name: product.name,
                                    product_price: roundedPrice,
                                    quantity: Number(quantity),
                                    size_id: cartItem.size_id || null,
                                    color_id: cartItem.color_id || null,
                                    size_name: cartItem.size_name || null,
                                    color_name: cartItem.color_name || null
                                });
                            }
                        });
                    } else {
                        // Fallback: Use itemCount (from cookies or aggregated data)
                        Object.keys(itemCount).forEach(itemId => {
                            const itemIdNum = Number(itemId);
                            const product = allProducts.find(p => p.id === itemIdNum);
                            
                            if (product) {
                                const quantity = itemCount[itemId];
                                const roundedPrice = Math.round(Number(product.final_price || product.price || 0));
                                const itemTotal = Math.round(roundedPrice * quantity);
                                subtotal = Math.round(subtotal + itemTotal);
                                
                                orderItemsData.push({
                                    product_id: null, // MockAPI IDs are not UUIDs, so set to null
                                    product_name: product.name,
                                    product_price: roundedPrice,
                                    quantity: Number(quantity)
                                });
                            }
                        });
                    }
                    
                    const totalAmount = Math.round(subtotal + deliveryCharges);
                    
                    // Validate that we have order items
                    if (orderItemsData.length === 0) {
                        hideSubmitLoader();
                        showSubmitError('No valid items found in cart. Please add items to cart first.');
                        isSubmitting = false;
                        return;
                    }
                    
                    // Step 1: Create order in orders table
                    createOrder(totalCounter, subtotal, deliveryCharges, totalAmount, orderItemsData, {
                        full_name: fullName,
                        phone_number: fullPhoneNumber,
                        email: email || null,
                        delivery_address: address,
                        city: city,
                        postal_code: postalCode || null,
                        province: province
                    }).catch(error => {
                        hideSubmitLoader();
                        showSubmitError('Error creating order. Please try again.');
                        isSubmitting = false;
                    });
                    
                } catch (error) {
                    hideSubmitLoader();
                    showSubmitError('Error loading cart items. Please try again.');
                    isSubmitting = false;
                }
            } else {
                hideSubmitLoader();
                showSubmitError('Error loading cart items. Please try again.');
                isSubmitting = false;
            }
        }
    };
    
    productsRequest.onerror = function() {
        hideSubmitLoader();
        showSubmitError('Network error. Please check your connection and try again.');
        isSubmitting = false;
    };
    
    productsRequest.open('GET', PRODUCTS_API, true);
    productsRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    productsRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
    productsRequest.send();
    });
}

// Function to create order in orders table
async function createOrder(totalItems, subtotal, deliveryCharges, totalAmount, orderItemsData, deliveryData) {
    // Get current user if logged in
    let userId = null;
    if (window.auth && window.auth.getCurrentUser) {
        const { user } = await window.auth.getCurrentUser();
        if (user) {
            userId = user.id;
        }
    }

    const orderData = {
        total_items: Number(totalItems),
        subtotal: Number(subtotal),
        delivery_charges: Number(deliveryCharges),
        total_amount: Number(totalAmount),
        payment_method: 'Cash on Delivery',
        order_status: 'pending',
        estimated_delivery: '3 to 5 business days'
    };

    // Add user_id if user is logged in
    if (userId) {
        orderData.user_id = userId;
    }
    
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 201) {
                    try {
                        const orderResponse = JSON.parse(this.responseText);
                        const orderId = orderResponse[0].id; // Get order ID from response
                        
                        // Step 2: Create order items
                        createOrderItems(orderId, orderItemsData, deliveryData);
                        resolve(orderResponse);
                    } catch (e) {
                        hideSubmitLoader();
                        showSubmitError('Error creating order. Please try again.');
                        isSubmitting = false;
                        reject(e);
                    }
                } else {
                    hideSubmitLoader();
                    showSubmitError('Error creating order. Please try again.');
                    isSubmitting = false;
                    reject(new Error('Failed to create order: ' + this.status));
                }
            }
        };
        
        httpRequest.onerror = function() {
            hideSubmitLoader();
            showSubmitError('Network error. Please check your connection and try again.');
            isSubmitting = false;
            reject(new Error('Network error'));
        };
        
        httpRequest.open('POST', SUPABASE_BASE_URL + '/orders', true);
        httpRequest.setRequestHeader('Content-Type', 'application/json');
        httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
        httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
        httpRequest.setRequestHeader('Prefer', 'return=representation');
        httpRequest.send(JSON.stringify(orderData));
    });
}

// Function to create order items
function createOrderItems(orderId, orderItemsData, deliveryData) {
    // Create all order items
    const orderItemsPromises = orderItemsData.map(item => {
        return new Promise((resolve, reject) => {
            // Build itemData with only required fields first
            const itemData = {
                order_id: orderId,
                product_id: null, // MockAPI IDs are not UUIDs, so set to null
                product_name: String(item.product_name),
                product_price: Number(item.product_price),
                quantity: Number(item.quantity)
            };
            
            // Only add variant fields if they exist and have values
            // NOTE: These columns must exist in the order_items table
            // Run ADD_VARIANT_COLUMNS_TO_ORDER_ITEMS.sql if you get 400 errors
            if (item.size_id !== null && item.size_id !== undefined && item.size_id !== '') {
                itemData.size_id = Number(item.size_id);
            }
            if (item.color_id !== null && item.color_id !== undefined && item.color_id !== '') {
                itemData.color_id = Number(item.color_id);
            }
            if (item.size_name && String(item.size_name).trim() !== '') {
                itemData.size_name = String(item.size_name).trim();
            }
            if (item.color_name && String(item.color_name).trim() !== '') {
                itemData.color_name = String(item.color_name).trim();
            }
            
            const httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (this.readyState === 4) {
                    if (this.status === 201) {
                        resolve();
                    } else {
                        // Log the error for debugging
                        console.error('Order item creation error:', this.status, this.responseText);
                        // Try to parse error message
                        let errorMsg = 'Failed to create order item';
                        try {
                            const errorData = JSON.parse(this.responseText);
                            if (errorData.message) {
                                errorMsg = errorData.message;
                            } else if (errorData.error) {
                                errorMsg = errorData.error;
                            }
                        } catch (e) {
                            errorMsg = this.responseText || errorMsg;
                        }
                        reject(new Error(errorMsg + ' (Status: ' + this.status + ')'));
                    }
                }
            };
            
            httpRequest.onerror = function() {
                reject(new Error('Network error while creating order item'));
            };
            
            const url = `${SUPABASE_BASE_URL}/order_items`;
            httpRequest.open('POST', url, true);
            httpRequest.setRequestHeader('Content-Type', 'application/json');
            httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
            httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
            httpRequest.setRequestHeader('Prefer', 'return=representation');
            
            // Log the data being sent for debugging
            console.log('Creating order item:', itemData);
            
            httpRequest.send(JSON.stringify(itemData));
        });
    });
    
    // Wait for all order items to be created, then create delivery details
    Promise.all(orderItemsPromises)
        .then(() => {
            // Step 3: Create delivery details
            createDeliveryDetails(orderId, deliveryData);
        })
        .catch((error) => {
            hideSubmitLoader();
            console.error('Error creating order items:', error);
            // Show more specific error message
            let errorMessage = 'Error saving order items. Please try again.';
            if (error.message) {
                if (error.message.includes('column') && error.message.includes('does not exist')) {
                    errorMessage = 'Database schema mismatch. Variant columns may not exist. Please contact support or remove variant selection.';
                } else if (error.message.includes('400')) {
                    errorMessage = 'Invalid data format. Please check your cart items and try again.';
                } else {
                    errorMessage = 'Error: ' + error.message;
                }
            }
            showSubmitError(errorMessage);
            isSubmitting = false;
        });
}

// Function to create delivery details
function createDeliveryDetails(orderId, deliveryData) {
    const deliveryDetailsData = {
        order_id: orderId,
        full_name: deliveryData.full_name,
        phone_number: deliveryData.phone_number,
        email: deliveryData.email,
        delivery_address: deliveryData.delivery_address,
        city: deliveryData.city,
        postal_code: deliveryData.postal_code,
        province: deliveryData.province
    };
    
    const httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
            hideSubmitLoader();
            
            if (this.status === 201) {
                // Success - all data saved
                try {
                    const response = JSON.parse(this.responseText);
                    
                    // Clear cart cookies
                    document.cookie = "orderId= ,counter=0";
                    
                    // Update badge
                    const badge = document.getElementById("badge");
                    if (badge) badge.innerHTML = '0';
                    
                    // Redirect to order placed page
                    window.location.href = 'orderPlaced.html';
                } catch (e) {
                    // Still redirect on success
                    window.location.href = 'orderPlaced.html';
                }
            } else if (this.status === 0) {
                // Network error or CORS issue
                showSubmitError('Network error. Please check your connection and try again.');
                isSubmitting = false;
            } else {
                // Other errors
                try {
                    const errorResponse = JSON.parse(this.responseText);
                    showSubmitError('Error saving delivery details. Please try again.');
                } catch (e) {
                    showSubmitError('Error saving delivery details. Please try again.');
                }
                isSubmitting = false;
            }
        }
    };
    
    httpRequest.onerror = function() {
        hideSubmitLoader();
        showSubmitError('Network error. Please check your connection and try again.');
        isSubmitting = false;
    };
    
    httpRequest.open('POST', SUPABASE_BASE_URL + '/delivery_details', true);
    httpRequest.setRequestHeader('Content-Type', 'application/json');
    httpRequest.setRequestHeader('apikey', SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Authorization', 'Bearer ' + SUPABASE_ANON_KEY);
    httpRequest.setRequestHeader('Prefer', 'return=representation');
    httpRequest.send(JSON.stringify(deliveryDetailsData));
}

// Initialize form submission when DOM is ready
// Only initialize once to prevent duplicate event listeners
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormSubmission);
} else {
    initFormSubmission();
}

// Load summary on page load - INSTANT from cache
function initOrderSummary() {
    // Prevent multiple initializations
    if (orderSummaryInitialized) {
        return;
    }
    orderSummaryInitialized = true;
    // Load immediately (will check cache first)
    loadOrderSummary();
}

// Initialize both order summary and saved addresses instantly
function initCheckoutPage() {
    // Load order summary instantly
    initOrderSummary();
    
    // Initialize saved addresses instantly (from cache)
    initSavedAddresses();
}

// Try to load immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initCheckoutPage();
    });
} else {
    // DOM already loaded, initialize immediately
    initCheckoutPage();
}

// REMOVED: Window load event listener that was reloading order summary
// This was causing items to be cleared when they already exist
// The order summary loads instantly from cache/state manager, so no need to reload
// window.addEventListener('load', function() {
//     setTimeout(() => {
//         // Only reload if summary is still empty
//         const summaryContent = document.getElementById('summaryContent');
//         if (summaryContent && (summaryContent.innerHTML.includes('No items in cart') || summaryContent.innerHTML.trim() === '')) {
//             loadOrderSummary();
//         }
//     }, 1000);
// });

// Initialize saved addresses functionality - INSTANT from cache
function initSavedAddresses() {
    const savedAddressesSection = document.getElementById('savedAddressesSection');
    const saveAddressBtn = document.getElementById('saveAddressBtn');
    
    if (!savedAddressesSection) {
        return;
    }
    
    // STEP 1: Check cache FIRST (instant, synchronous)
    let addresses = null;
    if (window.savedAddresses && typeof window.savedAddresses.getCachedAddresses === 'function') {
        addresses = window.savedAddresses.getCachedAddresses();
    }
    
    // STEP 2: Show/hide section instantly based on cache
    if (addresses && addresses.length > 0) {
        // Show section instantly
        savedAddressesSection.style.display = 'block';
        
        // Display addresses instantly from cache
        const addressesContainer = document.getElementById('addressesContainer');
        const skeletonLoader = document.getElementById('addressesSkeleton');
        
        if (addressesContainer) {
            if (skeletonLoader) {
                skeletonLoader.style.display = 'none';
            }
            addressesContainer.innerHTML = '';
            addressesContainer.style.display = 'grid';
            
            // Display addresses as cards
            addresses.forEach(address => {
                const card = createAddressCard(address);
                addressesContainer.appendChild(card);
            });
            
            // Auto-populate form with default address if one exists
            const defaultAddress = addresses.find(addr => addr.is_default);
            if (defaultAddress) {
                fillFormFromSavedAddress(defaultAddress.id);
                const defaultRadio = document.getElementById(`address-${defaultAddress.id}`);
                if (defaultRadio) {
                    defaultRadio.checked = true;
                }
            }
            
            // Show save button if less than 3 addresses
            if (saveAddressBtn) {
                if (addresses.length < 3) {
                    saveAddressBtn.style.display = 'inline-block';
                } else {
                    saveAddressBtn.style.display = 'none';
                }
            }
        }
    } else {
        // Hide section if no addresses in cache
        savedAddressesSection.style.display = 'none';
    }
    
    // STEP 3: Load from database in background (async, non-blocking)
    loadSavedAddressesInBackground();
    
    // Handle save address button
    if (saveAddressBtn) {
        saveAddressBtn.addEventListener('click', async function() {
            await saveCurrentAddress();
        });
    }
}

// Load saved addresses from database in background (non-blocking)
async function loadSavedAddressesInBackground() {
    try {
        if (!window.auth || typeof window.auth.getCurrentUser !== 'function') {
            return; // Auth not available
        }
        
        const { user } = await window.auth.getCurrentUser();
        if (!user) {
            return; // User not logged in
        }
        
        // Load from database (will update cache and UI if different)
        await loadSavedAddresses();
    } catch (error) {
        // Ignore errors
    }
}

// Load saved addresses into cards
async function loadSavedAddresses() {
    try {
        if (!window.savedAddresses || typeof window.savedAddresses.getSavedAddresses !== 'function') {
            return;
        }

        const addressesContainer = document.getElementById('addressesContainer');
        const skeletonLoader = document.getElementById('addressesSkeleton');
        const saveAddressBtn = document.getElementById('saveAddressBtn');
        const savedAddressesSection = document.getElementById('savedAddressesSection');

        if (!addressesContainer) {
            return;
        }

        // Check localStorage first for instant loading
        let addresses = null;
        if (window.savedAddresses && typeof window.savedAddresses.getCachedAddresses === 'function') {
            addresses = window.savedAddresses.getCachedAddresses();
        }

        // If we have cached addresses, use them instantly
        if (addresses && addresses.length > 0) {
            // Hide skeleton if it was showing
            if (skeletonLoader) {
                skeletonLoader.style.display = 'none';
            }

            // Clear container
            addressesContainer.innerHTML = '';

            // Show the saved addresses section
            if (savedAddressesSection) {
                savedAddressesSection.style.display = 'block';
            }

            // Show the addresses container
            if (addressesContainer) {
                addressesContainer.style.display = 'grid';
            }

            // Display addresses as cards
            addresses.forEach(address => {
                const card = createAddressCard(address);
                addressesContainer.appendChild(card);
            });

            // Auto-populate form with default address if one exists
            const defaultAddress = addresses.find(addr => addr.is_default);
            if (defaultAddress) {
                // Fill form with default address
                fillFormFromSavedAddress(defaultAddress.id);
                // Ensure the radio button is checked
                const defaultRadio = document.getElementById(`address-${defaultAddress.id}`);
                if (defaultRadio) {
                    defaultRadio.checked = true;
                }
            }

            // Show save button if less than 3 addresses
            if (saveAddressBtn) {
                if (addresses.length < 3) {
                    saveAddressBtn.style.display = 'inline-block';
                } else {
                    saveAddressBtn.style.display = 'none';
                }
            }
        }

        // Show skeleton loader if no cache
        if (!addresses || addresses.length === 0) {
            if (skeletonLoader) {
                skeletonLoader.style.display = 'grid';
            }
            addressesContainer.innerHTML = '';

            // Simulate loading delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Fetch from API (will update cache)
        const fetchedAddresses = await window.savedAddresses.getSavedAddresses();
        
        // Hide skeleton
        if (skeletonLoader) {
            skeletonLoader.style.display = 'none';
        }

        // Use fetched addresses if available, otherwise use cached addresses
        const addressesToDisplay = fetchedAddresses.length > 0 ? fetchedAddresses : (addresses || []);

        // Display addresses as cards
        if (addressesToDisplay.length === 0) {
            // Only hide if we truly have no addresses (neither cached nor from API)
            if (savedAddressesSection) {
                savedAddressesSection.style.display = 'none';
            }
            if (saveAddressBtn) saveAddressBtn.style.display = 'inline-block';
            return;
        }

        // Show the saved addresses section when addresses exist
        if (savedAddressesSection) {
            savedAddressesSection.style.display = 'block';
        }

        // Show the addresses container when addresses exist
        if (addressesContainer) {
            addressesContainer.style.display = 'grid';
        }

        // Only re-render if addresses changed (to avoid duplicate cards and unnecessary re-renders)
        const currentAddressIds = Array.from(addressesContainer.querySelectorAll('.address-card')).map(card => {
            const radio = card.querySelector('input[type="radio"]');
            return radio ? radio.id.replace('address-', '') : null;
        }).filter(id => id !== null);

        const addressesToDisplayIds = addressesToDisplay.map(addr => String(addr.id));
        
        // Only update if addresses actually changed
        if (JSON.stringify(currentAddressIds.sort()) !== JSON.stringify(addressesToDisplayIds.sort())) {
            addressesContainer.innerHTML = '';
            addressesToDisplay.forEach(address => {
                const card = createAddressCard(address);
                addressesContainer.appendChild(card);
            });
            
            // Auto-populate form with default address if one exists
            const defaultAddress = addressesToDisplay.find(addr => addr.is_default);
            if (defaultAddress) {
                // Fill form with default address
                fillFormFromSavedAddress(defaultAddress.id);
                // Ensure the radio button is checked
                const defaultRadio = document.getElementById(`address-${defaultAddress.id}`);
                if (defaultRadio) {
                    defaultRadio.checked = true;
                }
            }
            
            // Show save button if less than 3 addresses
            if (saveAddressBtn) {
                if (addressesToDisplay.length < 3) {
                    saveAddressBtn.style.display = 'inline-block';
                } else {
                    saveAddressBtn.style.display = 'none';
                }
            }
        }

        // Auto-populate form with default address if one exists
        const defaultAddress = fetchedAddresses.find(addr => addr.is_default);
        if (defaultAddress) {
            // Fill form with default address
            fillFormFromSavedAddress(defaultAddress.id);
            // Ensure the radio button is checked
            const defaultRadio = document.getElementById(`address-${defaultAddress.id}`);
            if (defaultRadio) {
                defaultRadio.checked = true;
            }
        }

        // Show save button if less than 3 addresses
        if (saveAddressBtn) {
            if (fetchedAddresses.length < 3) {
                saveAddressBtn.style.display = 'inline-block';
            } else {
                saveAddressBtn.style.display = 'none';
            }
        }
    } catch (error) {
        const skeletonLoader = document.getElementById('addressesSkeleton');
        if (skeletonLoader) {
            skeletonLoader.style.display = 'none';
        }
    }
}

// Create address card element
function createAddressCard(address) {
    const card = document.createElement('div');
    card.className = 'address-card';
    card.dataset.addressId = address.id;
    if (address.is_default) {
        card.classList.add('selected');
    }

    // Generate map placeholder URL (using Google Maps Static API format)
    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(address.city + ', Pakistan')}&zoom=13&size=400x150&markers=color:0x037a7a|${encodeURIComponent(address.city + ', Pakistan')}&key=AIzaSyDummyKey`;
    // Using a placeholder image instead since we don't have API key
    const mapPlaceholder = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="150" viewBox="0 0 400 150"><rect fill="%23e0f2fe" width="400" height="150"/><text x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="%23037a7a">${address.city}</text></svg>`)}`;

    card.innerHTML = `
        <div class="address-card-header">
            <div class="address-checkbox-wrapper">
                <input type="radio" name="selectedAddress" class="address-radio" value="${address.id}" ${address.is_default ? 'checked' : ''} id="address-${address.id}">
            </div>
            <div class="address-card-header-actions">
                <button type="button" class="address-delete-btn" data-address-id="${address.id}" title="Delete Address">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="address-map">
                <i class="fas fa-map-marker-alt"></i>
            </div>
        </div>
        <div class="address-card-body">
            <div class="address-label">
                <span class="address-label-text">
                    ${address.address_label}
                    ${address.is_default ? '<span class="address-label-badge">Default</span>' : ''}
                </span>
            </div>
        </div>
    `;

    // Add click handler to select address
    const radio = card.querySelector('.address-radio');
    radio.addEventListener('change', function() {
        if (this.checked) {
            // Remove selected class from all cards
            document.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
            // Add selected class to this card
            card.classList.add('selected');
            // Fill form with this address
            fillFormFromSavedAddress(address.id);
        }
    });

    // Add delete button handler
    const deleteBtn = card.querySelector('.address-delete-btn');
    deleteBtn.addEventListener('click', async function(e) {
        e.stopPropagation();
        await deleteAddress(address.id);
    });

    // Make entire card clickable
    card.addEventListener('click', function(e) {
        if (e.target.closest('.address-delete-btn')) {
            return; // Don't trigger if clicking delete button
        }
        radio.checked = true;
        radio.dispatchEvent(new Event('change'));
    });

    return card;
}

// Delete address with confirmation
async function deleteAddress(addressId) {
    try {
        // Show confirmation dialog
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this address? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Delete',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6c757d',
            width: '90%',
            maxWidth: '500px',
            padding: '1.5em'
        });

        if (!result.isConfirmed) {
            return; // User cancelled
        }

        // Show loading
        Swal.fire({
            title: 'Deleting...',
            text: 'Please wait',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            width: '90%',
            maxWidth: '400px',
            padding: '1.5em',
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const { error } = await window.savedAddresses.deleteAddress(addressId);

        Swal.close();

        if (error) {
            let errorMessage = 'Unknown error occurred. Please try again.';
            
            // Provide more specific error messages
            if (error.message) {
                errorMessage = error.message;
            } else if (error.hint) {
                errorMessage = error.hint;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            await Swal.fire({
                icon: 'error',
                title: 'Failed to Delete',
                html: `<div style="text-align: left;">${errorMessage}</div>`,
                confirmButtonColor: 'rgb(3, 122, 122)',
                width: '90%',
                maxWidth: '500px',
                padding: '1.5em'
            });
        } else {
            await Swal.fire({
                icon: 'success',
                title: 'Address Deleted!',
                text: 'The address has been deleted successfully.',
                confirmButtonColor: 'rgb(3, 122, 122)',
                width: '90%',
                maxWidth: '500px',
                padding: '1.5em',
                timer: 2000,
                timerProgressBar: true
            });
            // Clear cache and reload addresses
            if (window.savedAddresses && typeof window.savedAddresses.clearAddressesCache === 'function') {
                window.savedAddresses.clearAddressesCache();
            }
            await loadSavedAddresses();
        }
    } catch (error) {
        Swal.close();
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            html: `<div style="text-align: left;">Failed to delete address: ${error.message || 'Unknown error'}.<br><br>Please try again.</div>`,
            confirmButtonColor: 'rgb(3, 122, 122)',
            width: '90%',
            maxWidth: '500px',
            padding: '1.5em'
        });
    }
}

// Fill form from saved address
async function fillFormFromSavedAddress(addressId) {
    try {
        if (!window.savedAddresses || typeof window.savedAddresses.getSavedAddresses !== 'function') {
            return;
        }

        const addresses = await window.savedAddresses.getSavedAddresses();
        const address = addresses.find(addr => addr.id === addressId);
        
        if (!address) {
            return;
        }

        // Fill form fields
        const fullNameInput = document.getElementById('fullName');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        const addressInput = document.getElementById('address');
        const citySelect = document.getElementById('city');
        const postalCodeInput = document.getElementById('postalCode');
        const stateInput = document.getElementById('state');

        if (fullNameInput) fullNameInput.value = address.full_name || '';
        if (phoneInput) {
            // Remove +92 prefix if present
            const phone = address.phone_number.replace(/^\+92/, '');
            phoneInput.value = phone;
        }
        if (emailInput) emailInput.value = address.email || '';
        if (addressInput) addressInput.value = address.delivery_address || '';
        if (citySelect) {
            citySelect.value = address.city || '';
            // Trigger city change to update postal code and province
            if (citySelect.value) {
                citySelect.dispatchEvent(new Event('change'));
            }
        }
        if (postalCodeInput) postalCodeInput.value = address.postal_code || '';
        if (stateInput) stateInput.value = address.province || '';
    } catch (error) {
    }
}

// Save current address
async function saveCurrentAddress() {
    try {
        if (!window.savedAddresses || typeof window.savedAddresses.saveAddress !== 'function') {
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Address saving is not available. Please try again later.',
                confirmButtonColor: 'rgb(3, 122, 122)',
                width: '90%',
                maxWidth: '500px',
                padding: '1.5em'
            });
            return;
        }

        // Get form values
        const fullName = document.getElementById('fullName')?.value.trim();
        const phone = document.getElementById('phone')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const address = document.getElementById('address')?.value.trim();
        const city = document.getElementById('city')?.value.trim();
        const postalCode = document.getElementById('postalCode')?.value.trim();
        const province = document.getElementById('state')?.value.trim();

        // Validate required fields
        if (!fullName || !phone || !address || !city || !province) {
            await Swal.fire({
                icon: 'warning',
                title: 'Missing Information',
                text: 'Please fill in all required fields before saving the address.',
                confirmButtonColor: 'rgb(3, 122, 122)',
                width: '90%',
                maxWidth: '500px',
                padding: '1.5em'
            });
            return;
        }

        // Get full phone number with country code
        const phoneInput = document.getElementById('phone');
        const fullPhoneNumber = phoneInput ? getFullPhoneNumber(phoneInput) : `+92${phone}`;

        // Check if user already has 3 addresses
        const addresses = await window.savedAddresses.getSavedAddresses();
        if (addresses.length >= 3) {
            await Swal.fire({
                icon: 'warning',
                title: 'Address Limit Reached',
                html: 'You can only save up to 3 addresses (Home, Work, Office).<br>Please delete an existing address to add a new one.',
                confirmButtonColor: 'rgb(3, 122, 122)',
                width: '90%',
                maxWidth: '500px',
                padding: '1.5em'
            });
            return;
        }

        // Get available labels
        const usedLabels = addresses.map(a => a.address_label.toLowerCase());
        const availableLabels = ['Home', 'Work', 'Office'].filter(label => !usedLabels.includes(label.toLowerCase()));

        if (availableLabels.length === 0) {
            await Swal.fire({
                icon: 'warning',
                title: 'All Labels Used',
                html: 'You have already used all available address labels (Home, Work, Office).<br>Please delete an existing address to add a new one.',
                confirmButtonColor: 'rgb(3, 122, 122)',
                width: '90%',
                maxWidth: '500px',
                padding: '1.5em'
            });
            return;
        }

        // Prompt for address label using SweetAlert with boxes
        let selectedLabel = availableLabels[0] || null;
        
        const { value: addressLabel, isConfirmed } = await Swal.fire({
            title: 'Save Address',
            html: `
                <div style="text-align: left; margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 12px; font-weight: 600; color: #333; font-size: 14px;">Select Address Label</label>
                    <div id="swal-address-label-boxes" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 10px;">
                        ${['Home', 'Work', 'Office'].map(label => {
                            const isAvailable = availableLabels.includes(label);
                            const isSelected = label === selectedLabel;
                            return `
                                <div class="swal-address-label-box ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}" 
                                     data-label="${label}" 
                                     style="
                                         padding: 15px 10px;
                                         border: 2px solid ${isSelected ? 'rgb(3, 122, 122)' : isAvailable ? '#e0e0e0' : '#f0f0f0'};
                                         border-radius: 8px;
                                         text-align: center;
                                         cursor: ${isAvailable ? 'pointer' : 'not-allowed'};
                                         background: ${isSelected ? 'rgb(3, 122, 122)' : isAvailable ? 'white' : '#f9f9f9'};
                                         color: ${isSelected ? 'white' : isAvailable ? '#333' : '#999'};
                                         font-weight: ${isSelected ? '600' : '500'};
                                         font-size: 15px;
                                         transition: all 0.3s ease;
                                         opacity: ${isAvailable ? '1' : '0.5'};
                                     ">
                                    <i class="fas ${label === 'Home' ? 'fa-home' : label === 'Work' ? 'fa-briefcase' : 'fa-building'}" style="display: block; font-size: 24px; margin-bottom: 8px;"></i>
                                    <span>${label}</span>
                                    ${!isAvailable ? '<small style="display: block; font-size: 10px; margin-top: 4px; opacity: 0.7;">Used</small>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                    <small style="display: block; margin-top: 5px; color: #666; font-size: 12px;">You can save up to 3 addresses (Home, Work, Office)</small>
                </div>
            `,
            width: '90%',
            maxWidth: '600px',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Save',
            cancelButtonText: 'Cancel',
            confirmButtonColor: 'rgb(3, 122, 122)',
            cancelButtonColor: '#6c757d',
            buttonsStyling: true,
            didOpen: () => {
                // Add click handlers for label boxes
                const boxes = document.querySelectorAll('.swal-address-label-box:not(.disabled)');
                boxes.forEach(box => {
                    box.addEventListener('click', function() {
                        // Remove selected class from all boxes
                        document.querySelectorAll('.swal-address-label-box').forEach(b => {
                            b.classList.remove('selected');
                            b.style.border = b.classList.contains('disabled') ? '2px solid #f0f0f0' : '2px solid #e0e0e0';
                            b.style.background = b.classList.contains('disabled') ? '#f9f9f9' : 'white';
                            b.style.color = b.classList.contains('disabled') ? '#999' : '#333';
                            b.style.fontWeight = '500';
                        });
                        
                        // Add selected class to clicked box
                        this.classList.add('selected');
                        this.style.border = '2px solid rgb(3, 122, 122)';
                        this.style.background = 'rgb(3, 122, 122)';
                        this.style.color = 'white';
                        this.style.fontWeight = '600';
                        
                        // Update selected label
                        selectedLabel = this.dataset.label;
                    });
                });
            },
            preConfirm: () => {
                if (!selectedLabel) {
                    Swal.showValidationMessage('Please select an address label');
                    return false;
                }
                // Validate it's one of the allowed labels
                if (!['Home', 'Work', 'Office'].includes(selectedLabel)) {
                    Swal.showValidationMessage('Please select Home, Work, or Office');
                    return false;
                }
                return selectedLabel;
            }
        });

        if (!isConfirmed || !addressLabel) {
            return; // User cancelled
        }

        // Get addresses to check if we should ask about default
        const hasAddresses = addresses.length > 0;

        // Ask if this should be default (only if user has other addresses)
        let isDefault = false;
        if (hasAddresses) {
            const { value: setAsDefault } = await Swal.fire({
                title: 'Set as Default?',
                text: 'Do you want to set this as your default address?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Yes, set as default',
                cancelButtonText: 'No, just save',
                confirmButtonColor: 'rgb(3, 122, 122)',
                cancelButtonColor: '#6c757d',
                width: '90%',
                maxWidth: '500px',
                padding: '1.5em'
            });
            isDefault = setAsDefault === true;
        } else {
            // First address is automatically default
            isDefault = true;
        }

        // Save address
        const addressData = {
            address_label: addressLabel,
            full_name: fullName,
            phone_number: fullPhoneNumber,
            email: email || null,
            delivery_address: address,
            city: city,
            postal_code: postalCode || null,
            province: province,
            is_default: isDefault
        };

        // Show loading
        Swal.fire({
            title: 'Saving...',
            text: 'Please wait',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            width: '90%',
            maxWidth: '400px',
            padding: '1.5em',
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const { data, error } = await window.savedAddresses.saveAddress(addressData);

            Swal.close();

            if (error) {
                let errorMessage = 'Unknown error occurred. Please try again.';
                
                // Provide more specific error messages
                if (error.message) {
                    errorMessage = error.message;
                } else if (error.hint) {
                    errorMessage = error.hint;
                } else if (typeof error === 'string') {
                    errorMessage = error;
                }

                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Save',
                    html: `<div style="text-align: left;">${errorMessage}</div>`,
                    confirmButtonColor: 'rgb(3, 122, 122)',
                    width: '90%',
                    maxWidth: '500px',
                    padding: '1.5em'
                });
            } else if (data) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Address Saved!',
                    text: 'Your address has been saved successfully.',
                    confirmButtonColor: 'rgb(3, 122, 122)',
                    width: '90%',
                    maxWidth: '500px',
                    padding: '1.5em',
                    timer: 2000,
                    timerProgressBar: true
                });
                // Reload addresses
                await loadSavedAddresses();
            } else {
                // No data and no error - unexpected response
                await Swal.fire({
                    icon: 'error',
                    title: 'Failed to Save',
                    text: 'Unexpected response from server. Please try again.',
                    confirmButtonColor: 'rgb(3, 122, 122)',
                    width: '90%',
                    maxWidth: '500px',
                    padding: '1.5em'
                });
            }
        } catch (saveError) {
            Swal.close();
            await Swal.fire({
                icon: 'error',
                title: 'Error',
                html: `<div style="text-align: left;">Failed to save address: ${saveError.message || 'Unknown error'}.<br><br>Please check your connection and try again.</div>`,
                confirmButtonColor: 'rgb(3, 122, 122)',
                width: '90%',
                maxWidth: '500px',
                padding: '1.5em'
            });
        }
    } catch (error) {
        Swal.close();
        await Swal.fire({
            icon: 'error',
            title: 'Error',
            html: `<div style="text-align: left;">Failed to save address: ${error.message || 'Unknown error'}.<br><br>Please try again.</div>`,
            confirmButtonColor: 'rgb(3, 122, 122)',
            width: '90%',
            maxWidth: '500px',
            padding: '1.5em'
        });
    }
}

// Pre-fill checkout form with user profile data if logged in
async function prefillCheckoutForm() {
    if (!window.auth || typeof window.auth.getCurrentUser !== 'function') {
        return;
    }

    const { user } = await window.auth.getCurrentUser();
    if (!user) {
        return; // User not logged in
    }

    // Get user profile
    if (window.auth && typeof window.auth.getUserProfile === 'function') {
        const { profile } = await window.auth.getUserProfile(user.id);
        if (profile) {
            // Pre-fill form fields
            const fullNameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');

            if (fullNameInput && profile.full_name) {
                fullNameInput.value = profile.full_name;
            }

            if (emailInput && profile.email) {
                emailInput.value = profile.email;
            }

            if (phoneInput && profile.phone_number) {
                // Remove +92 prefix if present
                let phone = profile.phone_number.replace(/^\+92/, '').replace(/\s+/g, '');
                phoneInput.value = phone;
            }
        }
    }
}

// Pre-fill form when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(prefillCheckoutForm, 500);
    });
} else {
    setTimeout(prefillCheckoutForm, 500);
}

