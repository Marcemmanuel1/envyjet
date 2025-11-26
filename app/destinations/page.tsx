"use client";

import React, { useState } from 'react';
import Footer from '../components/Footer';
import NavbarES from '../components/NavbarES';

const DestinationsPage = () => {
  const topDestinations = [
    { name: 'United States', flag: '🇺🇸' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'United Arab Emirates', flag: '🇦🇪' },
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Greece', flag: '🇬🇷' },
    { name: 'Portugal', flag: '🇵🇹' },
    { name: 'Sweden', flag: '🇸🇪' }
  ];

  const allCountries = [
    { name: 'Afghanistan', flag: '🇦🇫' },
    { name: 'Albania', flag: '🇦🇱' },
    { name: 'Algeria', flag: '🇩🇿' },
    { name: 'American Samoa', flag: '🇦🇸' },
    { name: 'Angola, Republic Of', flag: '🇦🇴' },
    { name: 'Anguilla Is.', flag: '🇦🇮' },
    { name: 'Antarctica', flag: '🇦🇶' },
    { name: 'Antigua And Barbuda', flag: '🇦🇬' },
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Armenia', flag: '🇦🇲' },
    { name: 'Aruba Is.', flag: '🇦🇼' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Austria', flag: '🇦🇹' },
    { name: 'Azerbaijan, Republic Of', flag: '🇦🇿' },
    { name: 'Bahamas', flag: '🇧🇸' },
    { name: 'Bahrain', flag: '🇧🇭' },
    { name: 'Bangladesh', flag: '🇧🇩' },
    { name: 'Barbados', flag: '🇧🇧' },
    { name: 'Belarus, Republic Of', flag: '🇧🇾' },
    { name: 'Belgium', flag: '🇧🇪' },
    { name: 'Belize', flag: '🇧🇿' },
    { name: 'Benin', flag: '🇧🇯' },
    { name: 'Bermuda', flag: '🇧🇲' },
    { name: 'Bhutan', flag: '🇧🇹' },
    { name: 'Bolivia', flag: '🇧🇴' },
    { name: 'Bosnia And Herzegovina', flag: '🇧🇦' },
    { name: 'Botswana', flag: '🇧🇼' },
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'British Virgin Islands', flag: '🇻🇬' },
    { name: 'Brunei Darussalam', flag: '🇧🇳' },
    { name: 'Bulgaria', flag: '🇧🇬' },
    { name: 'Burkina Faso', flag: '🇧🇫' },
    { name: 'Burundi, Republic Of', flag: '🇧🇮' },
    { name: 'Cambodia', flag: '🇰🇭' },
    { name: 'Cameroon, Republic Of', flag: '🇨🇲' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Cape Verde, Republic Of', flag: '🇨🇻' },
    { name: 'Cayman Is.', flag: '🇰🇾' },
    { name: 'Central African Republic', flag: '🇨🇫' },
    { name: 'Chad, Republic Of', flag: '🇹🇩' },
    { name: 'Chile', flag: '🇨🇱' },
    { name: 'China', flag: '🇨🇳' },
    { name: 'Christmas Is.', flag: '🇨🇽' },
    { name: 'Cocos (Keeling) Is.', flag: '🇨🇨' },
    { name: 'Colombia', flag: '🇨🇴' },
    { name: 'Comoros Is.', flag: '🇰🇲' },
    { name: 'Congo, Democratic Rep. Of', flag: '🇨🇩' },
    { name: 'Congo, Republic Of', flag: '🇨🇬' },
    { name: 'Cook Is.', flag: '🇨🇰' },
    { name: 'Costa Rica', flag: '🇨🇷' },
    { name: 'Cote D\'Ivoire', flag: '🇨🇮' },
    { name: 'Croatia', flag: '🇭🇷' },
    { name: 'Cuba', flag: '🇨🇺' },
    { name: 'Cyprus', flag: '🇨🇾' },
    { name: 'Czech Republic', flag: '🇨🇿' },
    { name: 'Denmark', flag: '🇩🇰' },
    { name: 'Djibouti', flag: '🇩🇯' },
    { name: 'Dominica', flag: '🇩🇲' },
    { name: 'Dominican Republic', flag: '🇩🇴' },
    { name: 'Ecuador', flag: '🇪🇨' },
    { name: 'Egypt', flag: '🇪🇬' },
    { name: 'El Salvador', flag: '🇸🇻' },
    { name: 'Equatorial Guinea, Rep.', flag: '🇬🇶' },
    { name: 'Eritrea', flag: '🇪🇷' },
    { name: 'Estonia', flag: '🇪🇪' },
    { name: 'Ethiopia', flag: '🇪🇹' },
    { name: 'Falkland Is.', flag: '🇫🇰' },
    { name: 'Faroe Islands', flag: '🇫🇴' },
    { name: 'Fiji Islands', flag: '🇫🇯' },
    { name: 'Finland', flag: '🇫🇮' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'French Guiana', flag: '🇬🇫' },
    { name: 'French Polynesia', flag: '🇵🇫' },
    { name: 'Gabon', flag: '🇬🇦' },
    { name: 'Gambia, Republic Of', flag: '🇬🇲' },
    { name: 'Georgia', flag: '🇬🇪' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'Ghana', flag: '🇬🇭' },
    { name: 'Gibraltar', flag: '🇬🇮' },
    { name: 'Greece', flag: '🇬🇷' },
    { name: 'Greenland', flag: '🇬🇱' },
    { name: 'Grenada', flag: '🇬🇩' },
    { name: 'Guadeloupe', flag: '🇬🇵' },
    { name: 'Guam', flag: '🇬🇺' },
    { name: 'Guatemala', flag: '🇬🇹' },
    { name: 'Guernsey', flag: '🇬🇬' },
    { name: 'Guinea, Republic Of', flag: '🇬🇳' },
    { name: 'Guinea-Bissau', flag: '🇬🇼' },
    { name: 'Guyana', flag: '🇬🇾' },
    { name: 'Haiti', flag: '🇭🇹' },
    { name: 'Honduras', flag: '🇭🇳' },
    { name: 'Hong Kong', flag: '🇭🇰' },
    { name: 'Hungary', flag: '🇭🇺' },
    { name: 'Iceland', flag: '🇮🇸' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'Indonesia', flag: '🇮🇩' },
    { name: 'Iran', flag: '🇮🇷' },
    { name: 'Iraq', flag: '🇮🇶' },
    { name: 'Ireland', flag: '🇮🇪' },
    { name: 'Isle Of Man', flag: '🇮🇲' },
    { name: 'Israel', flag: '🇮🇱' },
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'Jamaica', flag: '🇯🇲' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'Jordan', flag: '🇯🇴' },
    { name: 'Kazakhstan', flag: '🇰🇿' },
    { name: 'Kenya', flag: '🇰🇪' },
    { name: 'Kiribati', flag: '🇰🇮' },
    { name: 'Korea (Republic)', flag: '🇰🇷' },
    { name: 'Korea, Dem. Peoples Rep.', flag: '🇰🇵' },
    { name: 'Kuwait', flag: '🇰🇼' },
    { name: 'Kyrgyzstan', flag: '🇰🇬' },
    { name: 'Lao People\'s Dem. Rep.', flag: '🇱🇦' },
    { name: 'Latvia', flag: '🇱🇻' },
    { name: 'Lebanon', flag: '🇱🇧' },
    { name: 'Lesotho, Kingdom Of', flag: '🇱🇸' },
    { name: 'Liberia', flag: '🇱🇷' },
    { name: 'Libyan Arab Jamahiriya', flag: '🇱🇾' },
    { name: 'Lithuania', flag: '🇱🇹' },
    { name: 'Luxembourg', flag: '🇱🇺' },
    { name: 'Macao', flag: '🇲🇴' },
    { name: 'Macedonia', flag: '🇲🇰' },
    { name: 'Madagascar', flag: '🇲🇬' },
    { name: 'Malawi', flag: '🇲🇼' },
    { name: 'Malaysia', flag: '🇲🇾' },
    { name: 'Maldives', flag: '🇲🇻' },
    { name: 'Mali', flag: '🇲🇱' },
    { name: 'Malta', flag: '🇲🇹' },
    { name: 'Marshall Is.', flag: '🇲🇭' },
    { name: 'Martinique Is.', flag: '🇲🇶' },
    { name: 'Mauritania', flag: '🇲🇷' },
    { name: 'Mauritius Is.', flag: '🇲🇺' },
    { name: 'Mayotte Is.', flag: '🇾🇹' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'Micronesia, Fed. States', flag: '🇫🇲' },
    { name: 'Moldova', flag: '🇲🇩' },
    { name: 'Monaco', flag: '🇲🇨' },
    { name: 'Mongolia', flag: '🇲🇳' },
    { name: 'Montenegro', flag: '🇲🇪' },
    { name: 'Montserrat Is.', flag: '🇲🇸' },
    { name: 'Morocco', flag: '🇲🇦' },
    { name: 'Mozambique, Republic Of', flag: '🇲🇿' },
    { name: 'Myanmar (Burma)', flag: '🇲🇲' },
    { name: 'Namibia', flag: '🇳🇦' },
    { name: 'Nauru', flag: '🇳🇷' },
    { name: 'Nepal', flag: '🇳🇵' },
    { name: 'Netherlands', flag: '🇳🇱' },
    { name: 'Netherlands Antilles', flag: '🇧🇶' },
    { name: 'New Caledonia Is.', flag: '🇳🇨' },
    { name: 'New Zealand', flag: '🇳🇿' },
    { name: 'Nicaragua, Republic Of', flag: '🇳🇮' },
    { name: 'Niger', flag: '🇳🇪' },
    { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'Northern Mariana Is.', flag: '🇲🇵' },
    { name: 'Norway', flag: '🇳🇴' },
    { name: 'Oman', flag: '🇴🇲' },
    { name: 'Pakistan', flag: '🇵🇰' },
    { name: 'Palau', flag: '🇵🇼' },
    { name: 'Panama', flag: '🇵🇦' },
    { name: 'Papua New Guinea', flag: '🇵🇬' },
    { name: 'Paraguay', flag: '🇵🇾' },
    { name: 'Peru', flag: '🇵🇪' },
    { name: 'Philippines', flag: '🇵🇭' },
    { name: 'Poland', flag: '🇵🇱' },
    { name: 'Portugal', flag: '🇵🇹' },
    { name: 'Puerto Rico', flag: '🇵🇷' },
    { name: 'Qatar', flag: '🇶🇦' },
    { name: 'Republic of Nicaragua', flag: '🇳🇮' },
    { name: 'Reunion Is.', flag: '🇷🇪' },
    { name: 'Romania', flag: '🇷🇴' },
    { name: 'Russian Federation', flag: '🇷🇺' },
    { name: 'Rwanda', flag: '🇷🇼' },
    { name: 'Saint Helena', flag: '🇸🇭' },
    { name: 'Saint Kitts And Nevis', flag: '🇰🇳' },
    { name: 'Saint Lucia', flag: '🇱🇨' },
    { name: 'Samoa', flag: '🇼🇸' },
    { name: 'Sao Tome & Principe', flag: '🇸🇹' },
    { name: 'Saudi Arabia', flag: '🇸🇦' },
    { name: 'Senegal', flag: '🇸🇳' },
    { name: 'Serbia', flag: '🇷🇸' },
    { name: 'Seychelles', flag: '🇸🇨' },
    { name: 'Sierra Leone', flag: '🇸🇱' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'Slovak Republic', flag: '🇸🇰' },
    { name: 'Slovenia, Republic Of', flag: '🇸🇮' },
    { name: 'Solomon Islands', flag: '🇸🇧' },
    { name: 'Somalia', flag: '🇸🇴' },
    { name: 'South Africa', flag: '🇿🇦' },
    { name: 'South Sudan', flag: '🇸🇸' },
    { name: 'Spain', flag: '🇪🇸' },
    { name: 'Sri Lanka', flag: '🇱🇰' },
    { name: 'St Barthelemy', flag: '🇧🇱' },
    { name: 'St Martin Is.', flag: '🇲🇫' },
    { name: 'St Pierre & Miquelon', flag: '🇵🇲' },
    { name: 'St. Vincent & Grenadines', flag: '🇻🇨' },
    { name: 'Sudan', flag: '🇸🇩' },
    { name: 'Suriname', flag: '🇸🇷' },
    { name: 'Svalbard & Jan Mayen Is.', flag: '🇸🇯' },
    { name: 'Swaziland, Kingdom Of', flag: '🇸🇿' },
    { name: 'Sweden', flag: '🇸🇪' },
    { name: 'Switzerland', flag: '🇨🇭' },
    { name: 'Syrian Arab Republic', flag: '🇸🇾' },
    { name: 'Taiwan, Republic Of China', flag: '🇹🇼' },
    { name: 'Tajikistan', flag: '🇹🇯' },
    { name: 'Tanzania (United Rep. Of)', flag: '🇹🇿' },
    { name: 'Thailand', flag: '🇹🇭' },
    { name: 'Timor-Leste', flag: '🇹🇱' },
    { name: 'Togo', flag: '🇹🇬' },
    { name: 'Tonga', flag: '🇹🇴' },
    { name: 'Trinidad & Tobago', flag: '🇹🇹' },
    { name: 'Tunisia', flag: '🇹🇳' },
    { name: 'Turkey', flag: '🇹🇷' },
    { name: 'Turkmenistan', flag: '🇹🇲' },
    { name: 'Turks & Caicos Islands', flag: '🇹🇨' },
    { name: 'Tuvalu', flag: '🇹🇻' },
    { name: 'U.S. Virgin Is.', flag: '🇻🇮' },
    { name: 'Uganda', flag: '🇺🇬' },
    { name: 'Ukraine', flag: '🇺🇦' },
    { name: 'United Arab Emirates', flag: '🇦🇪' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'Uruguay', flag: '🇺🇾' },
    { name: 'Uzbekistan, Republic Of', flag: '🇺🇿' },
    { name: 'Vanuatu', flag: '🇻🇺' },
    { name: 'Venezuela', flag: '🇻🇪' },
    { name: 'Vietnam', flag: '🇻🇳' },
    { name: 'Wallis And Futuna Is.', flag: '🇼🇫' },
    { name: 'Western Sahara', flag: '🇪🇭' },
    { name: 'Yemen, Republic Of', flag: '🇾🇪' },
    { name: 'Zambia', flag: '🇿🇲' },
    { name: 'Zimbabwe', flag: '🇿🇼' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavbarES />
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-64 md:h-80"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&h=400&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 to-gray-800/50"></div>
        <div className="relative container px-4 md:px-8 mx-auto h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-white font-bold mb-4 text-center md:text-left">
            Destinations
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl text-center md:text-left">
            We fly to over 40,000 airports in 157 countries
          </p>
        </div>
      </div>

      {/* Top Destinations Section */}
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Envyjet top private jet destinations
          </h2>
          <p className="text-gray-700 text-base md:text-lg mb-8">
            This is a list of the most popular countries to fly with us. You can see the list of regions and list of airports in a particular region in these countries.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topDestinations.map((country, index) => (
              <div
                key={index}
                className="
                  bg-gray-50 p-4 flex items-center gap-3 
                  cursor-pointer border border-gray-200
                  transition-all duration-300 ease-out
                  hover:transform hover:-translate-y-2 hover:shadow-lg
                  hover:border-gray-300 hover:bg-white
                  relative
                "
              >
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0  bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                <span className="text-3xl relative z-10">{country.flag}</span>
                <span className="text-gray-800 font-medium relative z-10">{country.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* All Countries Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#b8922e] mb-4">
            List of countries
          </h2>
          <p className="text-gray-700 text-base md:text-lg mb-8">
            Here you can see all countries in the world, in alphabetical order
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {allCountries.map((country, index) => (
              <div
                key={index}
                className="
                  bg-white p-3 flex items-center gap-3 
                  cursor-pointer border border-gray-200
                  transition-all duration-300 ease-out
                  hover:transform hover:-translate-y-1 hover:shadow-lg
                  hover:border-gray-300 hover:bg-gray-50
                  relative
                "
              >
                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

                <span className="text-2xl flex-shrink-0 relative z-10">{country.flag}</span>
                <span className="text-gray-700 text-sm md:text-base relative z-10">{country.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DestinationsPage;