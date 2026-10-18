# Search rework: Change 2 API evidence

Local preview: http://127.0.0.1:3055. Tested 2026-10-18T17:57:01.333Z. 32 requests PASS.

All requests use the local application routes. No API keys are included. Only a disposable visitor and its test row were changed.

## 1. GET /api/cities

HTTP 400

```json
{
  "error": {
    "code": "INVALID_COUNTRY",
    "message": "Choose a supported country."
  }
}
```

## 2. GET /api/cities?country=xx&q=Par

HTTP 400

```json
{
  "error": {
    "code": "INVALID_COUNTRY",
    "message": "Choose a supported country."
  }
}
```

## 3. GET /api/cities?country=fr&q=Pa

HTTP 400

```json
{
  "error": {
    "code": "INVALID_SEARCH",
    "message": "Enter a city name between 3 and 120 characters."
  }
}
```

## 4. GET /api/cities?country=fr&q=

HTTP 400

```json
{
  "error": {
    "code": "INVALID_SEARCH",
    "message": "Enter a city name between 3 and 120 characters."
  }
}
```

## 5. GET /api/places/search

HTTP 400

```json
{
  "error": {
    "code": "INVALID_SEARCH",
    "message": "Enter a place name between 3 and 120 characters."
  }
}
```

## 6. GET /api/places/search?name=ab

HTTP 400

```json
{
  "error": {
    "code": "INVALID_SEARCH",
    "message": "Enter a place name between 3 and 120 characters."
  }
}
```

## 7. GET /api/places/search?name=

HTTP 400

```json
{
  "error": {
    "code": "INVALID_SEARCH",
    "message": "Enter a place name between 3 and 120 characters."
  }
}
```

## 8. GET /api/places/search?name=Eiffel&sort=distance

HTTP 400

```json
{
  "error": {
    "code": "INVALID_SORT",
    "message": "Choose a non-distance sort for a worldwide search."
  }
}
```

## 9. GET /api/places?city=Paris&country=xx

HTTP 400

```json
{
  "error": {
    "code": "INVALID_COUNTRY",
    "message": "Choose a supported country."
  }
}
```

## 10. GET /api/places?city=Pa&country=fr

HTTP 400

```json
{
  "error": {
    "code": "INVALID_CITY",
    "message": "Enter a city name between 3 and 120 characters."
  }
}
```

## 11. GET /api/places?city=Paris&cityId=city

HTTP 400

```json
{
  "error": {
    "code": "INVALID_COUNTRY",
    "message": "Choose a country for this city."
  }
}
```

## 12. GET /api/cities?country=in&q=Che

HTTP 200

```json
{
  "cities": [
    {
      "id": "51927538ba4a11544059d8bf46edd92a2a40f00103f901e4acb9c000000000c002089203074368656e6e6169",
      "name": "Chennai",
      "label": "Chennai, Tamil Nadu, India",
      "country": "in",
      "state": "Tamil Nadu"
    }
  ]
}
```

## 13. GET /api/cities?country=in&q=Che

HTTP 200

```json
{
  "cities": [
    {
      "id": "51927538ba4a11544059d8bf46edd92a2a40f00103f901e4acb9c000000000c002089203074368656e6e6169",
      "name": "Chennai",
      "label": "Chennai, Tamil Nadu, India",
      "country": "in",
      "state": "Tamil Nadu"
    }
  ]
}
```

## 14. GET /api/places?city=Chennai%2C+Tamil+Nadu%2C+India&country=in&cityId=51927538ba4a11544059d8bf46edd92a2a40f00103f901e4acb9c000000000c002089203074368656e6e6169&category=museums%2Cparks&sort=name

HTTP 200

```json
{
  "places": [
    {
      "id": "51af1f54675810544059dd8900602a332a40f00102f901a96407410000000092030e416c6578616e646572205061726b",
      "name": "Alexander Park",
      "address": "Alexander Park, Ward 73, Chennai, India",
      "category": "parks",
      "latitude": 13.1000981,
      "longitude": 80.2552684,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2437
    },
    {
      "id": "5128bfed754b12544059c4cfdacc0a212a40f00102f901f51dce430000000092030b416d6d61204d757365756d",
      "name": "Amma Museum",
      "address": "Amma Museum, Kamarajar Promenade, Zone 9 Teynampet, Chennai - 600005, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.0645084,
      "longitude": 80.2858424,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2725
    },
    {
      "id": "51c9e0f0003c125440591e6004ba9f212a40f00102f901551de4010000000092030d416e6e61204d656d6f7269616c",
      "name": "Anna Memorial",
      "address": "Anna Memorial, Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0655156,
      "longitude": 80.284891,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2573
    },
    {
      "id": "5137ae99d97612544059acc9547e23372a40f00102f901c8c6920100000000920309416e6e61205061726b",
      "name": "Anna Park",
      "address": "Anna Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1074156,
      "longitude": 80.2884059,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3294
    },
    {
      "id": "5180e54f95f41154405931113288d0192a40f00102f901d8c1d40200000000920311416e6e696520426573616e74205061726b",
      "name": "Annie Besant Park",
      "address": "Annie Besant Park, Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0504368,
      "longitude": 80.2805242,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3864
    },
    {
      "id": "51f57037126f10544059464f35037d242a40f00102f901e1472c43000000009203194368656e6e616920476f7665726e6d656e74204d757365756d",
      "name": "Chennai Government Museum",
      "address": "Chennai Government Museum, பாந்தியன் சாலை, Zone 5 Royapuram, Chennai - 600008, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.0712808,
      "longitude": 80.2570433,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "openingHours": "Sa-Th 09:30-17:00",
      "distance": 1983
    },
    {
      "id": "5198f1afb67a0f5440597978b7069c262a40f00102f901eb18362700000000920310436865747061742045636f205061726b",
      "name": "Chetpat Eco Park",
      "address": "Chetpat Eco Park, Zone 8 Anna Nagar, Chennai - 600010, Tamil Nadu, India",
      "category": "parks",
      "latitude": 13.0756583,
      "longitude": 80.2434076,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3035
    },
    {
      "id": "517de436ba3812544059cf98c2628c222a40f00102f90111bafd0c000000009203274368696c6472656e277320526f61642053616665747920616e642054726166666963205061726b",
      "name": "Children's Road Safety and Traffic Park",
      "address": "Children's Road Safety and Traffic Park, Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0674235,
      "longitude": 80.2847135,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2398
    },
    {
      "id": "51f2a26bbfe21054405951b2038b592e2a40f00102f901d62edd0200000000",
      "name": "Choolai",
      "address": "Choolai, Chennai, India",
      "category": "parks",
      "latitude": 13.0905297,
      "longitude": 80.2638392,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1025
    },
    {
      "id": "51f137625d8a0f54405906402334d9372a40f00102f901dd072e0300000000920312436f72706f726174696f6e2047726f756e64",
      "name": "Corporation Ground",
      "address": "Corporation Ground, Perambur, Chennai - 600011, Tamil Nadu, India",
      "category": "parks",
      "latitude": 13.1089695,
      "longitude": 80.242849,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4082
    },
    {
      "id": "51fef4e86c8211544059d0d0e9becf342a40f00102f901f263e14500000000920310436f72706f726174696f6e205061726b",
      "name": "Corporation Park",
      "address": "Corporation Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1031051,
      "longitude": 80.2736006,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2190
    },
    {
      "id": "519e354d213e125440591b92cf1a46212a40f00102f901f61dce430000000092032844722e204d6172757468757220476f70616c616e2052616d616368616e6472616e204d757365756d",
      "name": "Dr. Maruthur Gopalan Ramachandran Museum",
      "address": "Dr. Maruthur Gopalan Ramachandran Museum, Kamarajar Promenade, Zone 9 Teynampet, Chennai - 600005, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.064988,
      "longitude": 80.2850421,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2630
    },
    {
      "id": "51297ffe366910544059da24f4d7d4232a40f00102f901d0472c430000000092031745676d6f7265204368696c6472656e73204d757365756d",
      "name": "Egmore Childrens Museum",
      "address": "Egmore Childrens Museum, Montieth Road, Zone 5 Royapuram, Chennai - 600008, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.0699899,
      "longitude": 80.2564232,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2132
    },
    {
      "id": "51d5a0c6a66d10544059a161273f44242a40f00102f9011599075a0000000092031845676d6f726520476f7665726e6d656e74204d757365756d",
      "name": "Egmore Government Museum",
      "address": "Egmore Government Museum, Montieth Road, Zone 5 Royapuram, Chennai - 600008, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.0706568,
      "longitude": 80.2571168,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2026
    },
    {
      "id": "51f1340f4a6b12544059b79b75d282272a40f00102f9013ca6b60100000000920309466f7274205061726b",
      "name": "Fort Park",
      "address": "Fort Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0772206,
      "longitude": 80.287824,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2041
    },
    {
      "id": "51c2f6472a6812544059dd04bfa255292a40f00102f90191e3f44000000000920316466f72742053742e2047656f726765204d757365756d",
      "name": "Fort St. George Museum",
      "address": "Fort St. George Museum, James Street, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.080677,
      "longitude": 80.2876057,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "openingHours": "Mo-Su 09:00 - 17:00; Fr off",
      "distance": 1916
    },
    {
      "id": "51f1087e05e90f5440593b4b16bd5f202a40f00102f90126f1730100000000920311486164646f777320526f6164205061726b",
      "name": "Haddows Road Park",
      "address": "Haddows Road Park, Zone 9 Teynampet, Chennai - 600006, Tamil Nadu, India",
      "category": "parks",
      "latitude": 13.0632497,
      "longitude": 80.2485634,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3264
    },
    {
      "id": "51d88b8f0f800f54405904112d50e31c2a40f00102f90183cb610100000000920315496e646570656e64656e636520446179205061726b",
      "name": "Independence Day Park",
      "address": "Independence Day Park, Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0562397,
      "longitude": 80.2421627,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4305
    },
    {
      "id": "519db2e43b421154405922ef66576b222a40f00103f9016a9b23740200000092031c496e64696120506f7374205068696c6174656c696320427572656175",
      "name": "India Post Philatelic Bureau",
      "address": "India Post Philatelic Bureau, Anna Salai (Mount Road), Zone 5 Royapuram, Chennai - 600005, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.0672252,
      "longitude": 80.2696676,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1832
    },
    {
      "id": "5125ff1d0d4410544059ff03638ed8192a40f00102f901e3856d01000000009203194b616c6169676e6172204e6f6f72616e647520506f6f6e6761",
      "name": "Kalaignar Noorandu Poonga",
      "address": "Kalaignar Centenary Park, Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0507497,
      "longitude": 80.2541167,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4056
    },
    {
      "id": "51adaa744d6c1054405932d6210e992f2a40f00102f9016e3d021d0000000092030c4b6f7361706574205061726b",
      "name": "Kosapet Park",
      "address": "Kosapet Park, Purasawalkam, Chennai, India",
      "category": "parks",
      "latitude": 13.0929722,
      "longitude": 80.2566102,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1796
    },
    {
      "id": "515f36af1c18115440598568fec40e252a40f00102f901183dcc0c000000009203114c616e67732047617264656e205061726b",
      "name": "Langs Garden Park",
      "address": "Langs Garden Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0718998,
      "longitude": 80.2675435,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1342
    },
    {
      "id": "51fd99bed643125440591e47c238952e2a40f00102f901fd5d2b400000000092030c4c6f616e6520537175617265",
      "name": "Loane Square",
      "address": "Loane Square, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0909823,
      "longitude": 80.2853906,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1835
    },
    {
      "id": "519be9ce853e125440595e6d21a800212a40f00102f901531de4010000000092030e4d2e472e52204d656d6f7269616c",
      "name": "M.G.R Memorial",
      "address": "M.G.R Memorial, Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0645878,
      "longitude": 80.2850414,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2665
    },
    {
      "id": "51a854489078125440594283fe3929352a40f00102f9017b7ef90c0000000092030c4d6161646920506f6f6e6761",
      "name": "Maadi Poonga",
      "address": "Hanging Gardens, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1038393,
      "longitude": 80.2886138,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3000
    },
    {
      "id": "51f86d64725712544059aa2c5787142c2a40f00102f90170bdce41000000009203184d6164726173204869676820436f757274204d757365756d",
      "name": "Madras High Court Museum",
      "address": "Madras High Court Museum, North Fort Road, Zone 5 Royapuram, Chennai - 600009, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.0860973,
      "longitude": 80.2865932,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1797
    },
    {
      "id": "51d47fd6fc78105440595787ed388f242a40f00103f901b01455320300000092030d4d61696e204275696c64696e67",
      "name": "Main Building",
      "address": "Main Building, பாந்தியன் சாலை, Zone 5 Royapuram, Chennai - 600008, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.0714052,
      "longitude": 80.2573845,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1947
    },
    {
      "id": "5160e2b917af1054405947f3f9f459212a40f00102f901954fe8200000000092031b4d61796f722053756e6461722052616f204e61696475205061726b",
      "name": "Mayor Sundar Rao Naidu Park",
      "address": "Mayor Sundar Rao Naidu Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0646692,
      "longitude": 80.260528,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2360
    },
    {
      "id": "5143b29780c711544059590f5a1cb4352a40f00102f901a0799a43000000009203094d696e74205061726b",
      "name": "Mint Park",
      "address": "Mint Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1048566,
      "longitude": 80.2776216,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2487
    },
    {
      "id": "513b31cc9519125440594d745aec8e2c2a40f00102f9013e6ca5010000000092030a4d4d432047726f756e64",
      "name": "MMC Ground",
      "address": "MMC Ground, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0870543,
      "longitude": 80.2827897,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1415
    },
    {
      "id": "51f26ce2677a11544059538d88528c252a40f00102f901896363430000000092030b4e6170696572205061726b",
      "name": "Napier Park",
      "address": "Napier Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0735729,
      "longitude": 80.2731252,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1170
    },
    {
      "id": "51765fe1e83f12544059cae64f938a232a40f00102f9014e83f5400000000092030a4e6176616c205061726b",
      "name": "Naval Park",
      "address": "Naval Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0693625,
      "longitude": 80.2852602,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2281
    },
    {
      "id": "51aa2bcb89e40e544059953b6e1e53252a40f00102f901aa4075170000000092031250616368617961707061732047726f756e64",
      "name": "Pachayappas Ground",
      "address": "Pachayappas Ground, Zone 8 Anna Nagar, Chennai, India",
      "category": "parks",
      "latitude": 13.072932,
      "longitude": 80.2326612,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4237
    },
    {
      "id": "5112c4d4f1730f5440599e341eb63e222a40f00103f901777326c5010000009203047061726b",
      "name": "park",
      "address": "park, Zone 9 Teynampet, Chennai - 600006, Tamil Nadu, India",
      "category": "parks",
      "latitude": 13.0668847,
      "longitude": 80.2414517,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3630
    },
    {
      "id": "5154db171b0b1054405911991a5079182a40f00102f901ee58ad01000000009203085061726b20313133",
      "name": "Park 113",
      "address": "Park 113, Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0477998,
      "longitude": 80.250678,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4516
    },
    {
      "id": "5127d2a94a30105440590371354246312a40f00102f901b8aed8010000000092030a506174656c205061726b",
      "name": "Patel Park",
      "address": "Patel Park, Ward 75, Chennai, India",
      "category": "parks",
      "latitude": 13.0962402,
      "longitude": 80.2529461,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2331
    },
    {
      "id": "518d1791386c11544059f89c0f30b72d2a40f00102f90120916c010000000092030d50656f706c652773205061726b",
      "name": "People's Park",
      "address": "People's Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0894822,
      "longitude": 80.2723825,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 686
    },
    {
      "id": "51f5679703e70f5440592cfc1550bb382a40f00102f90137f5fc0c00000000",
      "name": "Perambur",
      "address": "Perambur, Chennai, India",
      "category": "parks",
      "latitude": 13.1107999,
      "longitude": 80.248476,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3823
    },
    {
      "id": "5166598d650a1154405998d10afafb342a40f00102f901bf01032400000000",
      "name": "Pulianthope",
      "address": "Pulianthope, Chennai, India",
      "category": "parks",
      "latitude": 13.1034759,
      "longitude": 80.2662614,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2240
    },
    {
      "id": "5193067745aa115440596e72d68d57302a40f00102f9011f3ec6490000000092031152616a61737468616e692047726f756e64",
      "name": "Rajasthani Ground",
      "address": "Rajasthani Ground, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0944402,
      "longitude": 80.2759974,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1351
    },
    {
      "id": "51de9515ce7a1054405970e01a8cee302a40f00102f90194b0d8010000000092030f52616d616e756a616c75205061726b",
      "name": "Ramanujalu Park",
      "address": "Ramanujalu Park, Ward 76, Chennai, India",
      "category": "parks",
      "latitude": 13.0955173,
      "longitude": 80.2574907,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1902
    },
    {
      "id": "512983335b181054405972e24eb0d7192a40f00102f901edcd89010000000092030f53656e6d6f7a686920506f6f6e6761",
      "name": "Senmozhi Poonga",
      "address": "Semmozhi Poonga, Zone 9 Teynampet, Chennai - 600086, Tamil Nadu, India",
      "category": "parks",
      "latitude": 13.0506767,
      "longitude": 80.2514735,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4194
    },
    {
      "id": "51e038134dd7115440594367191e88342a40f00102f901a01c20460000000092030f53697661676e616e616d205061726b",
      "name": "Sivagnanam Park",
      "address": "Sivagnanam Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1025971,
      "longitude": 80.2787649,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2298
    },
    {
      "id": "51849edcf25811544059bab9a88992392a40f00102f90173e7f54000000000",
      "name": "Tondiarpet",
      "address": "Tondiarpet, Chennai, India",
      "category": "parks",
      "latitude": 13.1123358,
      "longitude": 80.2709826,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3186
    },
    {
      "id": "51b64d714c7a1054405968f573d175382a40f00102f901810be54500000000",
      "name": "Tondiarpet",
      "address": "Tondiarpet, Chennai, India",
      "category": "parks",
      "latitude": 13.1102739,
      "longitude": 80.2574645,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3261
    },
    {
      "id": "51d00a5daa6511544059efdfb75eeb392a40f00102f90174e7f54000000000",
      "name": "Tondiarpet",
      "address": "Tondiarpet, Chennai, India",
      "category": "parks",
      "latitude": 13.1130655,
      "longitude": 80.2718105,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3271
    },
    {
      "id": "517ba98e0b3d10544059518259fc01382a40f00102f9013af5fc0c00000000",
      "name": "Tondiarpet",
      "address": "Tondiarpet, Chennai, India",
      "category": "parks",
      "latitude": 13.1093902,
      "longitude": 80.2537259,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3368
    },
    {
      "id": "51193cd5fa63115440597f2bd103bb3a2a40f00102f901eb490c4000000000",
      "name": "Tondiarpet",
      "address": "Tondiarpet, Chennai, India",
      "category": "parks",
      "latitude": 13.1149041,
      "longitude": 80.2717898,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3475
    },
    {
      "id": "512ee2ca910511544059866035175a3f2a40f00102f901f2c2021c00000000",
      "name": "Tondiarpet",
      "address": "Tondiarpet, Chennai, India",
      "category": "parks",
      "latitude": 13.1237351,
      "longitude": 80.2659647,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4476
    },
    {
      "id": "51d1237f79f2105440593cc1d4cb7a3f2a40f00102f9015c94fd0c00000000",
      "name": "Tondiarpet",
      "address": "Tondiarpet, Chennai, India",
      "category": "parks",
      "latitude": 13.1239838,
      "longitude": 80.2647995,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4518
    },
    {
      "id": "519a1346580610544059db5e00357f3d2a40f00102f901f2edfc0c00000000",
      "name": "Tondiarpet",
      "address": "Tondiarpet, Chennai, India",
      "category": "parks",
      "latitude": 13.120125,
      "longitude": 80.2503987,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4583
    },
    {
      "id": "518b631b1b4812544059ca0e4339a1252a40f00102f9014def62430000000092030c566963746f7279205061726b",
      "name": "Victory Park",
      "address": "Victory Park, Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.073477,
      "longitude": 80.2856413,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2023
    },
    {
      "id": "51e4e631ddf01154405930f15ca352192a40f00102f9017e48e03c0000000092031b566976656b616e616e6461204865726974616765204d757365756d",
      "name": "Vivekananda Heritage Museum",
      "address": "Vivekananda Heritage Museum, Kamarajar Promenade, Zone 9 Teynampet, Chennai - 600005, Tamil Nadu, India",
      "category": "museums",
      "latitude": 13.0494839,
      "longitude": 80.2803247,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3959
    },
    {
      "id": "51e1cddb8ef111544059b5bc8ad026192a40f00102f9017f48e03c00000000920310566976656b616e616e6461205061726b",
      "name": "Vivekananda Park",
      "address": "Vivekananda Park, Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0491223,
      "longitude": 80.2803695,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3999
    },
    {
      "id": "51832c9fbd0b1054405959ef30a542342a40f00102f901ba64074100000000",
      "name": "Ward 71",
      "address": "Ward 71, Chennai, India",
      "category": "parks",
      "latitude": 13.1020748,
      "longitude": 80.2507172,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2937
    },
    {
      "id": "51160d1f98860f54405941439533a1362a40f00102f901e66efd0c00000000",
      "name": "Ward 71",
      "address": "Ward 71, Chennai, India",
      "category": "parks",
      "latitude": 13.1066475,
      "longitude": 80.2426017,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3929
    },
    {
      "id": "516fb6fc39c8105440598891bd51aa302a40f00102f901322add0200000000",
      "name": "Ward 76",
      "address": "Ward 76, Chennai, India",
      "category": "parks",
      "latitude": 13.0951254,
      "longitude": 80.2622377,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1535
    },
    {
      "id": "510eed2685b610544059228433509e312a40f00102f901145f5b0e00000000",
      "name": "Ward 76",
      "address": "Ward 76, Chennai, India",
      "category": "parks",
      "latitude": 13.0968844,
      "longitude": 80.2612906,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1755
    },
    {
      "id": "51c215423c8f105440595dedd52d63322a40f00102f9010391fc0c00000000",
      "name": "Ward 76",
      "address": "Ward 76, Chennai, India",
      "category": "parks",
      "latitude": 13.0984129,
      "longitude": 80.2587424,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2053
    },
    {
      "id": "517d41e6992d115440599fa7c14b562c2a40f00102f901f6105d0e00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0865781,
      "longitude": 80.2684118,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 374
    },
    {
      "id": "5193b46bbba311544059fae64295ec292a40f00102f9017c0dfc0c00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0818937,
      "longitude": 80.2756562,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 625
    },
    {
      "id": "5192b06513ab11544059dd838d1a082a2a40f00102f9017d0dfc0c00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0820843,
      "longitude": 80.2760681,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 662
    },
    {
      "id": "51da46945306115440591afedd062c282a40f00102f901d0f1bb0200000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0781427,
      "longitude": 80.265866,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 775
    },
    {
      "id": "514c30b649bd115440594efc2f110d2a2a40f00102f901670dfc0c00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0820924,
      "longitude": 80.2770421,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 764
    },
    {
      "id": "51e2d75944db10544059f84b9c4852292a40f00102f901c598f90c00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0807224,
      "longitude": 80.263371,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 809
    },
    {
      "id": "5189eebf0ff011544059e3528cf4a4292a40f00102f901206ca50100000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0810784,
      "longitude": 80.2802503,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1128
    },
    {
      "id": "51f04a3423241154405997404d604c232a40f00102f901453dcc0c00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0689067,
      "longitude": 80.267867,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1663
    },
    {
      "id": "51a06d7fc00f12544059193e448c26302a40f00102f901ee5b8d4b00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0940449,
      "longitude": 80.2822105,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1738
    },
    {
      "id": "51127e629c6c10544059735a8b0d85262a40f00102f901d59ff90c00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.0752459,
      "longitude": 80.2566236,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 1744
    },
    {
      "id": "51ae06c3e20c125440598525dff22c342a40f00102f9016e17c64900000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1018738,
      "longitude": 80.2820359,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2394
    },
    {
      "id": "51ebcb9ff4c411544059e1967e51da372a40f00102f901dfaad24900000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1090946,
      "longitude": 80.2776879,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2939
    },
    {
      "id": "515c70bc08a5115440595fae7818c0392a40f00102f9015c72fc0c00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1127867,
      "longitude": 80.2756985,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3290
    },
    {
      "id": "51adb6cce46712544059fa32533a7d382a40f00102f901324bfc0c00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1103336,
      "longitude": 80.2875912,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3511
    },
    {
      "id": "51544a8e9b401254405979dac9da6e392a40f00102f901314bfc0c00000000",
      "name": "Zone 5 Royapuram",
      "address": "Zone 5 Royapuram, Chennai, India",
      "category": "parks",
      "latitude": 13.1121739,
      "longitude": 80.2851933,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3560
    },
    {
      "id": "512095148201105440599de42181e2242a40f00102f901d89ff90c00000000",
      "name": "Zone 8 Anna Nagar",
      "address": "Zone 8 Anna Nagar, Chennai, India",
      "category": "parks",
      "latitude": 13.0718958,
      "longitude": 80.2499098,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2558
    },
    {
      "id": "516e18a9dced0f544059e14332c6ba242a40f00102f901d99ff90c00000000",
      "name": "Zone 8 Anna Nagar",
      "address": "Zone 8 Anna Nagar, Chennai, India",
      "category": "parks",
      "latitude": 13.0718333,
      "longitude": 80.2490743,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2640
    },
    {
      "id": "5130a77620c00f544059723104b4c0252a40f00102f901d69ff90c00000000",
      "name": "Zone 8 Anna Nagar",
      "address": "Zone 8 Anna Nagar, Chennai, India",
      "category": "parks",
      "latitude": 13.0737332,
      "longitude": 80.2460996,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2834
    },
    {
      "id": "51a265ecd6400f544059bb778ebff2242a40f00102f9014a53fb0c00000000",
      "name": "Zone 8 Anna Nagar",
      "address": "Zone 8 Anna Nagar, Chennai, India",
      "category": "parks",
      "latitude": 13.0721017,
      "longitude": 80.2383136,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3685
    },
    {
      "id": "51b534b742d80e544059dc7f0981012b2a40f00102f9017a4bfd0c00000000",
      "name": "Zone 8 Anna Nagar",
      "address": "Zone 8 Anna Nagar, Chennai, India",
      "category": "parks",
      "latitude": 13.0839959,
      "longitude": 80.2319495,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4141
    },
    {
      "id": "517a1fc3d8bc0e54405940227dbd1a2f2a40f00102f901daece70200000000",
      "name": "Zone 8 Anna Nagar",
      "address": "Zone 8 Anna Nagar, Chennai, India",
      "category": "parks",
      "latitude": 13.0920096,
      "longitude": 80.230274,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4421
    },
    {
      "id": "512f61e220db0e5440598684b3e147322a40f00102f9012d3dfd0c00000000",
      "name": "Zone 8 Anna Nagar",
      "address": "Zone 8 Anna Nagar, Chennai, India",
      "category": "parks",
      "latitude": 13.0982097,
      "longitude": 80.2321244,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4427
    },
    {
      "id": "51f12dff90a40e5440596e3a2a6270302a40f00102f901794bfd0c00000000",
      "name": "Zone 8 Anna Nagar",
      "address": "Zone 8 Anna Nagar, Chennai, India",
      "category": "parks",
      "latitude": 13.0946075,
      "longitude": 80.2287943,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4644
    },
    {
      "id": "51a1c779b04212544059b42b7f900e222a40f00102f9016ee5684000000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0666055,
      "longitude": 80.2852195,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2502
    },
    {
      "id": "513881d4c621125440595cc7e742c81f2a40f00102f90190459a0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0622168,
      "longitude": 80.2833154,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 2779
    },
    {
      "id": "51e5ca2a7b151254405998662f9d3c1e2a40f00102f90195459a0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0589855,
      "longitude": 80.2825462,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3056
    },
    {
      "id": "515b9489820b105440598481128a0d202a40f00102f901c188ca0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0626068,
      "longitude": 80.2506945,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3155
    },
    {
      "id": "51c4b8c5da0d12544059f26ad683141d2a40f00102f90196459a0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0568203,
      "longitude": 80.2821004,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3255
    },
    {
      "id": "51dd969a9493105440595f12d6f3601c2a40f00102f9011d119f0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0554255,
      "longitude": 80.2590073,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3368
    },
    {
      "id": "51af5b5a3704125440593bf0b97c3b1b2a40f00102f90198459a0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0531672,
      "longitude": 80.2815387,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3610
    },
    {
      "id": "510f829b81cb11544059bf5b35e49c1a2a40f00102f901a20d762200000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0519209,
      "longitude": 80.278075,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3635
    },
    {
      "id": "51de14dd1fec11544059836f9993621a2a40f00102f90166c9b33a00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0515369,
      "longitude": 80.2800351,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3731
    },
    {
      "id": "51c82db7fcf31154405976f1a8006a1a2a40f00102f90124d2b33a00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0515901,
      "longitude": 80.2805177,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3741
    },
    {
      "id": "51e5b59a48f511544059ca1c9bcf071a2a40f00102f901fde2b33a00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.050845,
      "longitude": 80.2806003,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3823
    },
    {
      "id": "51a3bedf1dee115440590a9263d0f0192a40f00102f90105feb33a00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.050669,
      "longitude": 80.2801208,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3827
    },
    {
      "id": "51450add99ef115440590e0bed44d3192a40f00102f901c5c4b43a00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0504384,
      "longitude": 80.2802463,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3855
    },
    {
      "id": "51b7154410fb1154405921f74ab1be192a40f00102f90193459a0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.050283,
      "longitude": 80.2809487,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 3894
    },
    {
      "id": "51444b654af61154405963643d5f99182a40f00102f90192459a0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0480887,
      "longitude": 80.2806629,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4119
    },
    {
      "id": "51a6bf5beb770f54405902dcd8fedd1c2a40f00102f90166c3550e00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0562289,
      "longitude": 80.2416913,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4342
    },
    {
      "id": "51cfdbc919ef1154405946d989fb03172a40f00102f90191459a0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0449485,
      "longitude": 80.280226,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4443
    },
    {
      "id": "512805422edf0e54405919b2493c4c212a40f00102f9015f90fa0c00000000",
      "name": "Zone 9 Teynampet",
      "address": "Zone 9 Teynampet, Chennai, India",
      "category": "parks",
      "latitude": 13.0650581,
      "longitude": 80.232372,
      "city": "Chennai",
      "state": "Tamil Nadu",
      "country": "India",
      "distance": 4590
    }
  ],
  "city": {
    "name": "Chennai - 600001, Tamil Nadu, India",
    "latitude": 13.0836939,
    "longitude": 80.270186
  },
  "resolvedState": "Tamil Nadu",
  "meta": {
    "limit": 100,
    "count": 100,
    "within": null,
    "distanceFrom": "city center",
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

## 15. GET /api/cities?country=fr&q=Par

HTTP 200

```json
{
  "cities": [
    {
      "id": "517808e3a7718f024059852f0219f06d4840f00101f901141d000000000000c002059203055061726973",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "5194a2957b81c9024059ece5d2533f6d4840f00103f90189b90f0100000000c002089203055061726973",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "512ead86c43d36024059ee9aeb8f8b6e4840f00101f9012d25000000000000c0020592031331367468204172726f6e64697373656d656e74",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "5145717d0ee2a9024059f57695ffda6c4840f00101f9013725000000000000c00205920312367468204172726f6e64697373656d656e74",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "51d034176eaf7b0240590fcb0b55d66f4840f00101f9018851000000000000c0020592031b387468204172726f6e64697373656d656e74206f66205061726973",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "51aa8251499d8002405954e81780a16d4840f00101f9013125000000000000c00205920312377468204172726f6e64697373656d656e74",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    }
  ]
}
```

## 16. GET /api/cities?country=fr&q=Par

HTTP 200

```json
{
  "cities": [
    {
      "id": "517808e3a7718f024059852f0219f06d4840f00101f901141d000000000000c002059203055061726973",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "5194a2957b81c9024059ece5d2533f6d4840f00103f90189b90f0100000000c002089203055061726973",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "512ead86c43d36024059ee9aeb8f8b6e4840f00101f9012d25000000000000c0020592031331367468204172726f6e64697373656d656e74",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "5145717d0ee2a9024059f57695ffda6c4840f00101f9013725000000000000c00205920312367468204172726f6e64697373656d656e74",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "51d034176eaf7b0240590fcb0b55d66f4840f00101f9018851000000000000c0020592031b387468204172726f6e64697373656d656e74206f66205061726973",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    },
    {
      "id": "51aa8251499d8002405954e81780a16d4840f00101f9013125000000000000c00205920312377468204172726f6e64697373656d656e74",
      "name": "Paris",
      "label": "Paris, Ile-de-France, France",
      "country": "fr",
      "state": "Ile-de-France"
    }
  ]
}
```

## 17. GET /api/places?city=Paris%2C+Ile-de-France%2C+France&country=fr&cityId=517808e3a7718f024059852f0219f06d4840f00101f901141d000000000000c002059203055061726973&category=museums%2Cparks&sort=name

HTTP 200

```json
{
  "places": [
    {
      "id": "51ba7c22069c9e024059ba8e85a5d96c4840f00102f9019a2cd62700000000",
      "name": "75006 Paris",
      "address": "75006 Paris, France",
      "category": "parks",
      "latitude": 48.8503771,
      "longitude": 2.3274731,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1092
    },
    {
      "id": "51a6e634b9098302405990760cfdf96d4840f00102f901a7a8260600000000",
      "name": "75007 Paris",
      "address": "75007 Paris, France",
      "category": "parks",
      "latitude": 48.8590953,
      "longitude": 2.3139349,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 447
    },
    {
      "id": "517484238d488302405909bccbeb236e4840f00102f9018cd4260600000000",
      "name": "75007 Paris",
      "address": "75007 Paris, France",
      "category": "parks",
      "latitude": 48.8605817,
      "longitude": 2.3141172,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 472
    },
    {
      "id": "5192921490e88302405933fd5063a66d4840f00102f9017bc3280600000000",
      "name": "75007 Paris",
      "address": "75007 Paris, France",
      "category": "parks",
      "latitude": 48.8566407,
      "longitude": 2.3144103,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 482
    },
    {
      "id": "517519bafe1983024059c00fdb064c6e4840f00102f90190d4260600000000",
      "name": "75007 Paris",
      "address": "75007 Paris, France",
      "category": "parks",
      "latitude": 48.8619655,
      "longitude": 2.3138715,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 566
    },
    {
      "id": "512e02d50d247f02405903974d7efb6d4840f00102f90179a8260600000000",
      "name": "75007 Paris",
      "address": "75007 Paris, France",
      "category": "parks",
      "latitude": 48.8590799,
      "longitude": 2.3120716,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 583
    },
    {
      "id": "516a869862687f024059a632f362256e4840f00102f90199a8260600000000",
      "name": "75007 Paris",
      "address": "75007 Paris, France",
      "category": "parks",
      "latitude": 48.86049,
      "longitude": 2.3122284,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 599
    },
    {
      "id": "5135df4ea5ed7f024059abd4b2d14e6e4840f00102f90187d4260600000000",
      "name": "75007 Paris",
      "address": "75007 Paris, France",
      "category": "parks",
      "latitude": 48.8619807,
      "longitude": 2.3127876,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 632
    },
    {
      "id": "51a544affcc1850240591bca83ddec6e4840f00102f90107cffa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8666011,
      "longitude": 2.3153264,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 924
    },
    {
      "id": "5115bf20dcdb83024059c6ceba6ee66e4840f00102f901ffcefa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8663761,
      "longitude": 2.314383,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 930
    },
    {
      "id": "5187d3121c847e0240595e1c2886c46e4840f00102f901d9b8fa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8653791,
      "longitude": 2.311792,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 941
    },
    {
      "id": "5103a9e211bc7d024059c61196a1bd6e4840f00102f901d6b8fa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.865151,
      "longitude": 2.3113911,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 941
    },
    {
      "id": "51a104e3e6287d0240590e62acbcba6e4840f00102f901dbb8fa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8650817,
      "longitude": 2.3111039,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 949
    },
    {
      "id": "51369af0246e83024059b8ae87a6ea6e4840f00102f901f8cefa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8665421,
      "longitude": 2.314186,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 953
    },
    {
      "id": "51177b30c5a87c0240597c29eec6ba6e4840f00102f901d4b8fa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8650885,
      "longitude": 2.3108672,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 962
    },
    {
      "id": "514980b63d66850240599e07eb23f76e4840f00102f901cd7bc62000000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8669177,
      "longitude": 2.3151355,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 962
    },
    {
      "id": "51b664b9f2688402405943cf2253f36e4840f00102f9010dcffa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8667932,
      "longitude": 2.3146879,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 962
    },
    {
      "id": "51509f8d15bc7c024059a2246b1bbf6e4840f00102f901cfb8fa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8652202,
      "longitude": 2.3109187,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 970
    },
    {
      "id": "51fac4ecb32c7d02405971bb0fa6c36e4840f00102f901d5b8fa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8653394,
      "longitude": 2.3111243,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 969
    },
    {
      "id": "510563239e2f7c024059481aa12bba6e4840f00102f901d1b8fa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8650531,
      "longitude": 2.3106309,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 971
    },
    {
      "id": "5127ce72b3877d02405995f8186aca6e4840f00101f901a3fa0f0000000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8655595,
      "longitude": 2.311298,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 979
    },
    {
      "id": "513ade39e6fa7c0240590bef594ec66e4840f00102f901e2b8fa0300000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8654219,
      "longitude": 2.3110225,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 981
    },
    {
      "id": "515524aa71ba830240592c52f750f86e4840f00102f901ce7bc62000000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8669658,
      "longitude": 2.3142749,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 992
    },
    {
      "id": "51fa5a00b5427c0240592a62f5a9c26e4840f00101f901a2fa0f0000000000",
      "name": "75008 Paris",
      "address": "75008 Paris, France",
      "category": "parks",
      "latitude": 48.8652764,
      "longitude": 2.3106453,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 988
    },
    {
      "id": "5154a4671fd06e02405970d86c9b986c4840f00103f901664e0a130300000092032e417374726f6c616265204553412048512056697369746f722043656e74657220616e642053706163652053686f70",
      "name": "Astrolabe ESA HQ Visitor Center and Space Shop",
      "address": "Astrolabe ESA HQ Visitor Center and Space Shop, 6 Rue Mario Nikis, 75015 Paris, France",
      "category": "museums",
      "latitude": 48.8484072,
      "longitude": 2.3041079,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.esa.int/ESA_Multimedia/Images/2024/01/Inside_the_Astrolabe_exhibition_at_ESA_s_Paris_headquarters",
      "openingHours": "Mo-Th 10:00-18:00; Fr-Sa 10:00-14:00; Su off",
      "distance": 1649
    },
    {
      "id": "518e57207a52a60240594cfc51d4996f4840f00103f901ac540355000000009203204269626c696f7468c3a87175652d4d7573c3a965206465206c274f70c3a97261",
      "name": "Bibliothèque-Musée de l'Opéra",
      "address": "Bibliothèque-Musée de l'Opéra, 8 Rue Scribe, 75009 Paris, France",
      "category": "museums",
      "latitude": 48.871882,
      "longitude": 2.331212,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.bnf.fr",
      "phone": "+33153793747",
      "openingHours": "Mo-Su 10:00-17:00",
      "distance": 1660
    },
    {
      "id": "51923e6eb81cbe0240594bb8cecf706e4840f00102f90152fd2e0100000000920312426f7572736520646520436f6d6d65726365",
      "name": "Bourse de Commerce",
      "address": "Bourse de Commerce, 2 Rue de Viarmes, 75001 Paris, France",
      "category": "museums",
      "latitude": 48.8628174,
      "longitude": 2.3428364,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.boursedecommerce.fr",
      "phone": "+33 1 55 04 60 60",
      "openingHours": "11:00-19:00; Tu off; Fr 11:00-21:00; May 01 off",
      "distance": 1724
    },
    {
      "id": "51903ca50a2662024059fe0e40e3926d4840f00102f901d33740000000000092030d4368616d70206465204d617273",
      "name": "Champ de Mars",
      "address": "Field of Mars, Paris, France",
      "category": "parks",
      "latitude": 48.8561447,
      "longitude": 2.2978204,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "openingHours": "24/7",
      "distance": 1654
    },
    {
      "id": "51fff1b96ea592024059f29881caf86b4840f00103f901b586490d03000000920310457370616365204b72616a6362657267",
      "name": "Espace Krajcberg",
      "address": "Espace Krajcberg, Villa Marie Vassilieff, 75015 Paris, France",
      "category": "museums",
      "latitude": 48.84353,
      "longitude": 2.3216046,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.espacekrajcberg.fr/",
      "openingHours": "Tu-Sa 14:00-18:00",
      "distance": 1712
    },
    {
      "id": "51ff379b33479b0240595f025c35746f4840f00103f901bc44b747020000009203124575726f706120457870c3a97269656e6365",
      "name": "Europa Expérience",
      "address": "Europa Expérience, 28 Place de la Madeleine, 75008 Paris, France",
      "category": "museums",
      "latitude": 48.8707339,
      "longitude": 2.3258194,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://visiting.europarl.europa.eu/fr/visitor-offer/other-locations/europa-experience/paris",
      "openingHours": "We-Mo 10:00-18:00",
      "distance": 1383
    },
    {
      "id": "517bbebb8ab67a024059e7e26acc7a6e4840f00102f9012f1c615400000000920309466c75637475617274",
      "name": "Fluctuart",
      "address": "Fluctuart, 2 Promenade Gisèle Halimi, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8631225,
      "longitude": 2.3099185,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://fluctuart.fr/",
      "openingHours": "Mo-Su 12:00-24:00",
      "distance": 877
    },
    {
      "id": "515d9bd722b3b4024059ba6180e9596e4840f00103f901e2ef601603000000920329466f6e646174696f6e204361727469657220706f7572206c2761727420636f6e74656d706f7261696e",
      "name": "Fondation Cartier pour l'art contemporain",
      "address": "Fondation Cartier pour l'art contemporain, 2 Place du Palais Royal, 75001 Paris, France",
      "category": "museums",
      "latitude": 48.8621189,
      "longitude": 2.3382323,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.fondationcartier.com",
      "phone": "+33 1 70 65 47 00",
      "openingHours": "Mo off; Tu 11:00-22:00; We-Su 11:00-20:00; May 01 off",
      "distance": 1378
    },
    {
      "id": "513cc4e81bc07f024059b051ee45de6e4840f00102f901b35259030000000092030c4772616e642050616c616973",
      "name": "Grand Palais",
      "address": "Great Palace, Avenue de Selves, 75008 Paris, France",
      "category": "museums",
      "latitude": 48.8661614,
      "longitude": 2.3122229,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.grandpalais.fr/",
      "phone": "+33 1 44 13 17 17",
      "openingHours": "Tu-Th, Sa-Su 09:30-20:00; Fr 09:30-22:30",
      "distance": 990
    },
    {
      "id": "5164d0f63993b50240599af9ee2c9f6d4840f00101f901f0c30e000000000092031448c3b474656c206465206c61204d6f6e6e616965",
      "name": "Hôtel de la Monnaie",
      "address": "Hôtel de la Monnaie, 11 Quai de Conti, 75006 Paris, France",
      "category": "museums",
      "latitude": 48.8564015,
      "longitude": 2.3384956,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.monnaiedeparis.fr",
      "openingHours": "Mo-Su 11:00-19:00; Th 11:00-22:00; Dec 25 off; Jan 01 off; May 01 off",
      "distance": 1378
    },
    {
      "id": "51d7cc2285c17c024059a873a47f5f6d4840f00102f901bf1bdb06000000009203154a617264696e206465206c27496e74656e64616e74",
      "name": "Jardin de l'Intendant",
      "address": "Jardin de l'Intendant, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.854538,
      "longitude": 2.3109145,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 825
    },
    {
      "id": "51be85dd3b019d024059f4fa7a918f6e4840f00102f901243c3503000000009203144a617264696e20646573205475696c6572696573",
      "name": "Jardin des Tuileries",
      "address": "Tuileries Garden, 113, 75001 Paris, France",
      "category": "parks",
      "latitude": 48.8635662,
      "longitude": 2.3269552,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.parisinfo.com/musee-monument-paris/71304/Jardin-des-Tuileries",
      "openingHours": "Mo-Su 07:30-21:00",
      "distance": 725
    },
    {
      "id": "51238d8c25deaf024059e4b9e1425e6c4840f00102f9018145a407000000009203144a617264696e206475204c7578656d626f757267",
      "name": "Jardin du Luxembourg",
      "address": "Luxembourg Garden, Paris, France",
      "category": "parks",
      "latitude": 48.8467228,
      "longitude": 2.3364148,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.senat.fr/visite/jardin/",
      "phone": "+33 1 42 34 23 62",
      "openingHours": "open \"check website https://www.senat.fr/visite/jardin/horaires.html\"; (sunset-00:30)-(sunrise-00:15) closed; Mar01-Sep30 (sunset-00:30)-07:30 closed",
      "distance": 1807
    },
    {
      "id": "51d2ceb699d5b30240593fe1d48cb86e4840f00102f901230d4100000000009203164a617264696e2064752050616c61697320526f79616c",
      "name": "Jardin du Palais Royal",
      "address": "Royal Palace Garden, 75001 Paris, France",
      "category": "parks",
      "latitude": 48.8649078,
      "longitude": 2.3377594,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "openingHours": "Mo-Su 08:00-22:30",
      "distance": 1459
    },
    {
      "id": "5142a6335aa893024059c2bac1f5866c4840f00102f9013f1e11230000000092031c4a617264696e2064752050c3a872652d41726d616e642d4461766964",
      "name": "Jardin du Père-Armand-David",
      "address": "Jardin du Père-Armand-David, 75006 Paris, France",
      "category": "parks",
      "latitude": 48.8479062,
      "longitude": 2.3220598,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1230
    },
    {
      "id": "519257846f40920240592108986ae16c4840f00102f901dfab891a000000009203114a617264696e20647520506f7461676572",
      "name": "Jardin du Potager",
      "address": "Jardin du Potager, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.8506286,
      "longitude": 2.3214116,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 924
    },
    {
      "id": "51d83e6e05cb86024059dd18c792656c4840f00102f901fc738e50000000009203134a617264696e2048656c656e204b656c6c6572",
      "name": "Jardin Helen Keller",
      "address": "Jardin Helen Keller, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.8468618,
      "longitude": 2.3158311,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1372
    },
    {
      "id": "5112a9a7f6c5c1024059735220a5666e4840f00102f901f3b97b09000000009203154a617264696e204e656c736f6e204d616e64656c61",
      "name": "Jardin Nelson Mandela",
      "address": "Jardin Nelson Mandela, 75001 Paris, France",
      "category": "parks",
      "latitude": 48.8626204,
      "longitude": 2.3449252,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "http://equipement.paris.fr/jardin-nelson-mandela-ex-des-halles-1765",
      "openingHours": "24/7",
      "distance": 1867
    },
    {
      "id": "51f7d15fd2a9b5024059d86d1f8dfc6e4840f00102f90188bd76420000000092030f4a617264696e2056697669656e6e65",
      "name": "Jardin Vivienne",
      "address": "Jardin Vivienne, 75002 Paris, France",
      "category": "parks",
      "latitude": 48.86713,
      "longitude": 2.3387259,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1646
    },
    {
      "id": "51402566752ab802405968b61829816e4840f00102f901325535030000000092032a4a617264696e657420706c616365206475206c69657574656e616e742048656e72692d4b617263686572",
      "name": "Jardinet place du lieutenant Henri-Karcher",
      "address": "Jardinet place du lieutenant Henri-Karcher, 75001 Paris, France",
      "category": "parks",
      "latitude": 48.8632707,
      "longitude": 2.3398809,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1531
    },
    {
      "id": "51c05528f81b820240590954ba8bdc6e4840f00101f9018dc29a000000000092031c4a617264696e7320646573204368616d70732dc3896c7973c3a96573",
      "name": "Jardins des Champs-Élysées",
      "address": "Jardins des Champs-Élysées, 75008 Paris, France",
      "category": "parks",
      "latitude": 48.8668388,
      "longitude": 2.3149325,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 960
    },
    {
      "id": "514972332ab997024059999a1714d36e4840f00102f901c2db3a030000000092030c4a6575206465205061756d65",
      "name": "Jeu de Paume",
      "address": "Jeu de Paume, Terrasse des Feuillants, 75001 Paris, France",
      "category": "museums",
      "latitude": 48.8658156,
      "longitude": 2.3240878,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://jeudepaume.org/",
      "phone": "+33 1 47 03 12 50",
      "openingHours": "Tu 11:00-21:00; We-Su 11:00-19:00",
      "distance": 825
    },
    {
      "id": "517d09151c5ea00240590483b57b036d4840f00103f901e354921e030000009203174c61204d6169736f6e2064657320686973746f69726573",
      "name": "La Maison des histoires",
      "address": "La Maison des histoires, 13 Rue de Sèvres, 75006 Paris, France",
      "category": "museums",
      "latitude": 48.8516688,
      "longitude": 2.3283045,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.lamaisondeshistoires.com/chantelivre",
      "openingHours": "We-Su 09:30-18:30",
      "distance": 1005
    },
    {
      "id": "51817dcfa33d89024059342f87dd776f4840f00103f901deb8ded2020000009203114c61204d6169736f6e20456c7973c3a965",
      "name": "La Maison Elysée",
      "address": "La Maison Elysée, 88 Rue du Faubourg Saint-Honoré, 75008 Paris, France",
      "category": "museums",
      "latitude": 48.8708455,
      "longitude": 2.3170121,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.elysee.fr/maison-elysee.fr",
      "openingHours": "Tu-Sa 11:00-18:30",
      "distance": 1348
    },
    {
      "id": "5189505bd9f4b60240590f4757e9ee6c4840f00103f901798794e4020000009203164d6169736f6e2064274175677573746520436f6d7465",
      "name": "Maison d'Auguste Comte",
      "address": "Maison d'Auguste Comte, Rue Monsieur le Prince, 75006 Paris, France",
      "category": "museums",
      "latitude": 48.851041,
      "longitude": 2.3393342,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://augustecomte.org/",
      "phone": "+33 1 43 26 08 56",
      "openingHours": "Tu-We 14:00-17:00; Sa[2] 14:00-17:00",
      "distance": 1660
    },
    {
      "id": "51b96bae3f2ea602405944ccdbc7c06d4840f00103f901f63a7d94020000009203114d6169736f6e204761696e73626f757267",
      "name": "Maison Gainsbourg",
      "address": "Maison Gainsbourg, 14 Rue de Verneuil, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8574457,
      "longitude": 2.3311429,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.maisongainsbourg.fr",
      "distance": 828
    },
    {
      "id": "51180225aa5cad024059b2440ce0d26c4840f00103f9013e86cce20100000092030b4d756e646f6c696e677561",
      "name": "Mundolingua",
      "address": "Mundolingua, 10 Rue Servandoni, 75006 Paris, France",
      "category": "museums",
      "latitude": 48.8501854,
      "longitude": 2.3346494,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.mundolingua.org",
      "distance": 1442
    },
    {
      "id": "5108dc89f85a8c024059f3e4c64cef6b4840f00101f901ff104101000000009203104d7573c3a96520426f757264656c6c65",
      "name": "Musée Bourdelle",
      "address": "Musée Bourdelle, 18 Rue Antoine Bourdelle, 75015 Paris, France",
      "category": "museums",
      "latitude": 48.843302,
      "longitude": 2.3186277,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.bourdelle.paris.fr/",
      "phone": "+33 1 49 54 73 73",
      "openingHours": "Tu-Su 10:00-18:00",
      "distance": 1736
    },
    {
      "id": "51f804d4cafe610240592911b35da26e4840f00102f9016ccab8040000000092031d4d7573c3a965206427417274204d6f6465726e65206465205061726973",
      "name": "Musée d'Art Moderne de Paris",
      "address": "Modern Art Museum of Paris, Rue Gaston de Saint-Paul, 75116 Paris, France",
      "category": "museums",
      "latitude": 48.8643133,
      "longitude": 2.2978602,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.mam.paris.fr/",
      "phone": "+33 1 53 67 40 00",
      "openingHours": "Tu-Su 10:00-18:00",
      "distance": 1731
    },
    {
      "id": "515b13c1ee2aba02405975633035f86c4840f00103f9013bb80155000000009203214d7573c3a965206427486973746f697265206465206c61204dc3a9646563696e65",
      "name": "Musée d'Histoire de la Médecine",
      "address": "Musée d'Histoire de la Médecine, 12 Rue de l'École de Médecine, 75006 Paris, France",
      "category": "museums",
      "latitude": 48.8513247,
      "longitude": 2.3409022,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://u-paris.fr/musee-de-lhistoire-de-la-medecine",
      "openingHours": "Mo-We,Fr,Sa 14:00-17:30",
      "distance": 1743
    },
    {
      "id": "514f80cd39bf9c024059e03c0b28126e4840f00102f9010108c4030000000092030e4d7573c3a9652064274f72736179",
      "name": "Musée d'Orsay",
      "address": "Museum of Orsay, 1 Rue de la Légion d'Honneur, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8599179,
      "longitude": 2.3265849,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.musee-orsay.fr/",
      "phone": "+33140494814",
      "openingHours": "Tu-Su 09:30-18:00; Th 09:30-21:45",
      "distance": 492
    },
    {
      "id": "51e2c226d7b97e0240597539ca66b36d4840f00103f9013d36c107000000009203124d7573c3a965206465206c2741726dc3a965",
      "name": "Musée de l'Armée",
      "address": "The Army Museum, 129 Rue de Grenelle, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8570374,
      "longitude": 2.3118779,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "http://www.musee-armee.fr/",
      "phone": "+33 1 44 42 38 77",
      "openingHours": "Nov-Mar: Mo-Su 10:00-17:00; Apr-Oct: Mo-Su 10:00-18:00; Apr-Sep: Tu 21:00+; Jan 1 off; May 1 off; Dec 25 off",
      "distance": 632
    },
    {
      "id": "5196eb504fce940240595f0fd7e18f6e4840f00102f901c4db3a03000000009203154d7573c3a965206465206c274f72616e6765726965",
      "name": "Musée de l'Orangerie",
      "address": "Orangerie Museum, Quai des Tuileries, 75001 Paris, France",
      "category": "museums",
      "latitude": 48.8637655,
      "longitude": 2.3226602,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.musee-orangerie.fr/",
      "phone": "+33144504300",
      "openingHours": "Mo-Su 09:00-18:00; Tu off",
      "distance": 575
    },
    {
      "id": "511096b1a19b7d0240590274a95b876d4840f00103f901ed14e6c4000000009203234d7573c3a965206465206c274f72647265206465206c61204c6962c3a9726174696f6e",
      "name": "Musée de l'Ordre de la Libération",
      "address": "Museum of the Order of the Liberation, 129 Rue de Grenelle, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8556933,
      "longitude": 2.311332,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.ordredelaliberation.fr/fr_doc/musee.html",
      "openingHours": "Apr 01-Oct 31: Mo-Su 10:00-18:00; Nov 01,Mar 31: Mo-Su 10:00-17:00",
      "distance": 730
    },
    {
      "id": "51f6f065a2089902405974f629221e6e4840f00103f90117f585050300000092033a4d7573c3a965206465206c61204cc3a967696f6e206427486f6e6e65757220657420646573204f72647265732064652043686576616c65726965",
      "name": "Musée de la Légion d'Honneur et des Ordres de Chevalerie",
      "address": "Musée de la Légion d'Honneur et des Ordres de Chevalerie, 2 Rue de la Légion d'Honneur, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8602946,
      "longitude": 2.3247235,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.legiondhonneur.fr/fr",
      "phone": "+33 1 40 62 84 25",
      "openingHours": "We-Su 13:00-18:00; Jan 01,May 01,Aug 15,Nov 01,Dec 25 off",
      "distance": 376
    },
    {
      "id": "511549055fe2a90240590e750e547c6e4840f00103f901c4d6c10e0000000092031b4d7573c3a9652064657320417274732044c3a9636f726174696673",
      "name": "Musée des Arts Décoratifs",
      "address": "Musée des Arts Décoratifs, 107 Rue de Rivoli, 75001 Paris, France",
      "category": "museums",
      "latitude": 48.8631692,
      "longitude": 2.3329513,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://madparis.fr/musee-des-arts-decoratifs",
      "phone": "+33 1 44 55 57 50",
      "distance": 1058
    },
    {
      "id": "51ddeb3046f984024059553d32f0d96e4840f00101f901e6662a000000000092032a4d7573c3a965206465732062656175782d61727473206465206c612056696c6c65206465205061726973",
      "name": "Musée des beaux-arts de la Ville de Paris",
      "address": "Museum of Fine Arts of the City of Paris, Avenue Winston Churchill, 75008 Paris, France",
      "category": "museums",
      "latitude": 48.866042,
      "longitude": 2.3153496,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.petitpalais.paris.fr/",
      "phone": "+33153434000",
      "openingHours": "Tu-Su 10:00-18:00",
      "distance": 866
    },
    {
      "id": "51ed050bccaf6b024059f9b770c56a6e4840f00103f901f22e7b98020000009203124d7573c3a9652064657320c3a9676f757473",
      "name": "Musée des égouts",
      "address": "Musée des égouts, Esplanade Habib Bourguiba, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8626334,
      "longitude": 2.3025814,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://musee-egouts.paris.fr",
      "phone": "+33 1 53 68 27 84",
      "openingHours": "Tu-Su 10:00-17:00; Dec 25,Jan 01-Jan 15 closed",
      "distance": 1343
    },
    {
      "id": "519412279c82810240591feffa71a06d4840f00103f901ee14e6c4000000009203184d7573c3a9652064657320506c616e732d52656c69656673",
      "name": "Musée des Plans-Reliefs",
      "address": "Museum of Relief Maps, 129 Rue de Grenelle, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8564589,
      "longitude": 2.3132374,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.museedesplansreliefs.culture.fr/",
      "phone": "+33 1 45 51 95 05",
      "openingHours": "Oct-Mar: Mo-Su 10:00-17:00; Apr-Sep: Mo-Su 10:00-18:00; Mo[1] off; Jan 1 off; May 1 off; Nov 1 off; Dec 25 off",
      "distance": 566
    },
    {
      "id": "5128b7380ff1b0024059b80495c9306e4840f00101f90122ad7200000000009203104d7573c3a965206475204c6f75767265",
      "name": "Musée du Louvre",
      "address": "Louvre Museum, Rue Saint-Honoré, 75001 Paris, France",
      "category": "museums",
      "latitude": 48.8611473,
      "longitude": 2.3380277,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.louvre.fr",
      "phone": "+33 1 40 20 52 29",
      "openingHours": "Mo,Th,Sa-Su 09:00-18:00; Tu off; We,Fr 09:00-21:00; Jan 01,May 01,Dec 25 off",
      "distance": 1340
    },
    {
      "id": "51f4c35d390fac0240591c9c5fde9e6c4840f00102f9017a74250a000000009203144d7573c3a965206475204c7578656d626f757267",
      "name": "Musée du Luxembourg",
      "address": "Musée du Luxembourg, Rue de Vaugirard, 75006 Paris, France",
      "category": "museums",
      "latitude": 48.8485709,
      "longitude": 2.3340107,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://museeduluxembourg.fr/",
      "phone": "+33140136200",
      "openingHours": "Mo-Su 10:00-19:00; Mo, Fr 10:00-21:30; Dec 24 10:00-18:00; Dec 31 10:00-18:00; Jan 01 10:00-18:00; Dec 25 off",
      "distance": 1537
    },
    {
      "id": "5170ed444948a40240594003a0408e6f4840f00103f90187ae8ed30200000092031a4d7573c3a9652064752050617266756d20467261676f6e617264",
      "name": "Musée du Parfum Fragonard",
      "address": "Musée du Parfum Fragonard, 9 Rue Scribe, 75009 Paris, France",
      "category": "museums",
      "latitude": 48.8715287,
      "longitude": 2.330216,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://musee-parfum-paris.fragonard.com/le-musee",
      "phone": "+33 1 47 42 04 56",
      "openingHours": "Mo-Sa 09:00-17:30; Su 09:00-17:00",
      "distance": 1590
    },
    {
      "id": "5152f0eaa2126202405940301fb7336e4840f00102f901a1f71101000000009203154d7573c3a9652064752071756169204272616e6c79",
      "name": "Musée du quai Branly",
      "address": "Quai Branly Museum, 37 Quai Branly, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8609943,
      "longitude": 2.2979696,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.quaibranly.fr/",
      "phone": "+33 1 56 61 70 00",
      "openingHours": "Tu-We, Fr-Su 10:30-19:00; Th 10:30-22:00",
      "distance": 1632
    },
    {
      "id": "51b4249b06a0bc024059c3a51941196e4840f00103f901a05350fd0000000092030f4d7573c3a96520656e204865726265",
      "name": "Musée en Herbe",
      "address": "Musée en Herbe, Rue de l'Arbre Sec, 75001 Paris, France",
      "category": "museums",
      "latitude": 48.8601457,
      "longitude": 2.3421021,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "http://www.musee-en-herbe.com",
      "openingHours": "Mo-Su 10:00-19:00",
      "distance": 1620
    },
    {
      "id": "51ef1b5f7b66990240596b03c12d696d4840f00103f901ac5102550000000092030e4d7573c3a965204d61696c6c6f6c",
      "name": "Musée Maillol",
      "address": "Musée Maillol, 59-61 Rue de Grenelle, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8547723,
      "longitude": 2.3249025,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.museemaillol.com",
      "phone": "+33 1 42 22 59 58",
      "distance": 580
    },
    {
      "id": "511db2b004daae0240590ec6ad7f656d4840f00102f90183359717000000009203214d7573c3a965206e6174696f6e616c20457567c3a86e652044656c6163726f6978",
      "name": "Musée national Eugène Delacroix",
      "address": "Musée national Eugène Delacroix, Rue Jacob, 75006 Paris, France",
      "category": "museums",
      "latitude": 48.8546415,
      "longitude": 2.3353937,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.musee-delacroix.fr",
      "phone": "+33144418650",
      "openingHours": "Mo-Su 09:30-17:30; Tu off; Jan 01 off; May 01 off; Dec 25 off",
      "distance": 1218
    },
    {
      "id": "51ddc0547ce086024059918613a3666d4840f00102f9013b95241c0000000092030c4d7573c3a96520526f64696e",
      "name": "Musée Rodin",
      "address": "Rodin Museum, 77 Rue de Varenne, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8547473,
      "longitude": 2.315867,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.musee-rodin.fr/",
      "phone": "+33144186110",
      "openingHours": "Tu-Su 10:00-18:30",
      "distance": 553
    },
    {
      "id": "51c7f143a511930240594f498c54ce6d4840f00103f9010a492a9c0200000092030d4d7573c3a96520736f6369616c",
      "name": "Musée social",
      "address": "Musée social, 5 Rue Las Cases, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8578592,
      "longitude": 2.321811,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.cedias.org/",
      "phone": "+33 1 45 51 99 51",
      "openingHours": "Mo-Th 09:00-12:00, 14:00-18:00; Fr 09:00-12:00, 14:00-17:00",
      "distance": 173
    },
    {
      "id": "517b5281ee26830240594795bc95806c4840f00103f901501b0155000000009203154d7573c3a9652056616c656e74696e204861c3bc79",
      "name": "Musée Valentin Haüy",
      "address": "Musée Valentin Haüy, 5 Rue Duroc, 75007 Paris, France",
      "category": "museums",
      "latitude": 48.8476741,
      "longitude": 2.3140391,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.avh.asso.fr",
      "phone": "+331 44 49 27 27",
      "distance": 1322
    },
    {
      "id": "515e335560f464024059e7bd1053cc6e4840f00102f90126cab804000000009203194d7573c3a9652059766573205361696e74204c617572656e74",
      "name": "Musée Yves Saint Laurent",
      "address": "Musée Yves Saint Laurent, Rue Léonce Reynaud, 75116 Paris, France",
      "category": "museums",
      "latitude": 48.8655906,
      "longitude": 2.2993156,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://museeyslparis.com",
      "phone": "+33 1 44 31 64 00",
      "distance": 1689
    },
    {
      "id": "51cbf8f71917ae024059bf2264c5156d4840f00103f9010d770055000000009203214d7573c3a9652d4c696272616972696520647520436f6d7061676e6f6e6e616765",
      "name": "Musée-Librairie du Compagnonnage",
      "address": "Musée-Librairie du Compagnonnage, 10 Rue Mabillon, 75006 Paris, France",
      "category": "museums",
      "latitude": 48.8522269,
      "longitude": 2.335005,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "http://www.compagnons.org",
      "phone": "+33 1 43 26 25 03",
      "openingHours": "Tu-Fr 14:00-18:00",
      "distance": 1322
    },
    {
      "id": "51798ef2d3a97c0240594d8a88f9df6e4840f00102f901c550360b0000000092031850616c616973206465206c612064c3a9636f757665727465",
      "name": "Palais de la découverte",
      "address": "Discovery Palace, Avenue Franklin Delano Roosevelt, 75008 Paris, France",
      "category": "museums",
      "latitude": 48.8662205,
      "longitude": 2.3108704,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.palais-decouverte.fr/",
      "openingHours": "Tu-Sa 09:30-18:00; Su,PH 10:00-19:00; Jan 01,May 01,Dec 25 off",
      "distance": 1056
    },
    {
      "id": "519a74b70d305f0240598e002a109d6e4840f00102f90197cab8040000000092030f50616c61697320646520546f6b796f",
      "name": "Palais de Tokyo",
      "address": "Palace of Tokyo, Rue de la Manutention, 75116 Paris, France",
      "category": "museums",
      "latitude": 48.8639905,
      "longitude": 2.2965215,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.palaisdetokyo.com/",
      "phone": "+33 1 81 97 35 88",
      "openingHours": "Mo-Su 12:00-24:00; Tu off; Jan 01 off; May 01 off; Dec 25 off; Dec 24 12:00- 18:00; Dec 31 12:00- 18:00",
      "distance": 1812
    },
    {
      "id": "514da5fa29e9ac0240591c66c3f5836f4840f00103f901b57e38970200000092030e50617261646f78204d757365756d",
      "name": "Paradox Museum",
      "address": "Paradox Museum, 30 Boulevard des Italiens, 75002 Paris, France",
      "category": "museums",
      "latitude": 48.8712146,
      "longitude": 2.3344291,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.paradoxmuseumparis.com",
      "openingHours": "Mo-Fr 10:00-20:00; Sa-Su 10:00-21:00",
      "distance": 1728
    },
    {
      "id": "51d7a8542994bd024059c3400b3ba26d4840f00102f901a36131030000000092030e506c616365204461757068696e65",
      "name": "Place Dauphine",
      "address": "Place Dauphine, 75001 Paris, France",
      "category": "parks",
      "latitude": 48.8564067,
      "longitude": 2.3426549,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1677
    },
    {
      "id": "51990bf9bea87b0240597eabe299cd6d4840f00102f90191a8260600000000920316506c6163652053616c7661646f7220416c6c656e6465",
      "name": "Place Salvador Allende",
      "address": "Salvador Allende Square, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.8577535,
      "longitude": 2.310311,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 723
    },
    {
      "id": "51b3551e58c8a902405948e82ddabc6c4840f00102f901be85be390000000092031d50726f6d656e616465204a65616e2d4a6163717565732053656d70c3a9",
      "name": "Promenade Jean-Jacques Sempé",
      "address": "Promenade Jean-Jacques Sempé, 75006 Paris, France",
      "category": "parks",
      "latitude": 48.849514,
      "longitude": 2.3329041,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1404
    },
    {
      "id": "51916f6447339b024059d6fcb0f7f96c4840f00101f901765069000000000092031053717561726520426f75636963617574",
      "name": "Square Boucicaut",
      "address": "Square Boucicaut, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.8511884,
      "longitude": 2.3256863,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 951
    },
    {
      "id": "51bc4251268a6b024059418c62908e6c4840f00102f90179860001000000009203105371756172652043616d62726f6e6e65",
      "name": "Square Cambronne",
      "address": "Square Cambronne, 75015 Paris, France",
      "category": "parks",
      "latitude": 48.8480788,
      "longitude": 2.3024918,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1759
    },
    {
      "id": "515794afb45a8202405968d2b114d76c4840f00102f901efe728060000000092031b537175617265206465206c27416262c3a92045737175657272c3a9",
      "name": "Square de l'Abbé Esquerré",
      "address": "Square de l'Abbé Esquerré, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.850256,
      "longitude": 2.313529,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1072
    },
    {
      "id": "51c155686f7798024059237276501c6d4840f00102f9016e0bf7000000000092032053717561726520646573204d697373696f6e7320c3897472616e67c3a8726573",
      "name": "Square des Missions Étrangères",
      "address": "Square des Missions Étrangères, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.852329,
      "longitude": 2.3247185,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 806
    },
    {
      "id": "51949dd92de4b8024059a132d059bf6d4840f00102f901e36c31030000000092031553717561726520647520566572742047616c616e74",
      "name": "Square du Vert Galant",
      "address": "Square du Vert Galant, 75001 Paris, France",
      "category": "parks",
      "latitude": 48.8574066,
      "longitude": 2.3403279,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "openingHours": "24/7",
      "distance": 1493
    },
    {
      "id": "518cad678e47ad0240592c6b128b466d4840f00102f901136db603000000009203185371756172652046c3a96c6978204465737275656c6c6573",
      "name": "Square Félix Desruelles",
      "address": "Square Félix Desruelles, 168b, 75006 Paris, France",
      "category": "parks",
      "latitude": 48.8536913,
      "longitude": 2.3347225,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.paris.fr/lieux/square-felix-desruelles-2456",
      "distance": 1220
    },
    {
      "id": "513e0c31c390b30240597ef9cd15bd6c4840f00102f901d704ba0300000000920316537175617265204672616e63697320506f756c656e63",
      "name": "Square Francis Poulenc",
      "address": "Square Francis Poulenc, 75006 Paris, France",
      "category": "parks",
      "latitude": 48.8495463,
      "longitude": 2.3377177,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1659
    },
    {
      "id": "51361d71a5c3b102405972347658af6d4840f00102f9019eaeb50300000000920316537175617265204761627269656c20506965726ec3a9",
      "name": "Square Gabriel Pierné",
      "address": "Square Gabriel Pierné, 75006 Paris, France",
      "category": "parks",
      "latitude": 48.8569158,
      "longitude": 2.3368075,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "website": "https://www.paris.fr/lieux/square-gabriel-pierne-2453",
      "distance": 1246
    },
    {
      "id": "51c20d996d356a0240595f89df289a6c4840f00102f901ec86000100000000920310537175617265204761726962616c6469",
      "name": "Square Garibaldi",
      "address": "Square Garibaldi, 75015 Paris, France",
      "category": "parks",
      "latitude": 48.8484832,
      "longitude": 2.3018936,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1761
    },
    {
      "id": "5184227b2f9eb002405912117cefbe6d4840f00102f901b196b6030000000092031753717561726520486f6e6f72c3a9204368616d70696f6e",
      "name": "Square Honoré Champion",
      "address": "Square Honoré Champion, 75006 Paris, France",
      "category": "parks",
      "latitude": 48.8574206,
      "longitude": 2.3362123,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1194
    },
    {
      "id": "51e2f0b5a6e8ab0240596866dd50586d4840f00102f90129a2950100000000920315537175617265204c617572656e7420507261636865",
      "name": "Square Laurent Prache",
      "address": "Square Laurent Prache, 1, 75006 Paris, France",
      "category": "parks",
      "latitude": 48.8542552,
      "longitude": 2.3339466,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1140
    },
    {
      "id": "512c15b7fbfe950240590f986cd6d96f4840f00102f901fbd6341b00000000920310537175617265204c6f75697320585649",
      "name": "Square Louis XVI",
      "address": "Square Louis XVI, 75008 Paris, France",
      "category": "parks",
      "latitude": 48.8738007,
      "longitude": 2.3235698,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1678
    },
    {
      "id": "51bf51f66559b3024059cc1dc0c1196f4840f00102f90146f890010000000092030e537175617265204c6f75766f6973",
      "name": "Square Louvois",
      "address": "Square Louvois, 75002 Paris, France",
      "category": "parks",
      "latitude": 48.8679528,
      "longitude": 2.3375626,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1630
    },
    {
      "id": "514b75722a949e024059ccd9bf81f26b4840f00102f90172d000030000000092030d537175617265204f7a616e616d",
      "name": "Square Ozanam",
      "address": "Square Ozanam, 75006 Paris, France",
      "category": "parks",
      "latitude": 48.8433359,
      "longitude": 2.3274091,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1812
    },
    {
      "id": "51c7a9be176981024059b00c38c9ec6c4840f00102f901fc6e08020000000092031753717561726520506965727265206465204761756c6c65",
      "name": "Square Pierre de Gaulle",
      "address": "Square Pierre de Gaulle, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.850984,
      "longitude": 2.3132032,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 1011
    },
    {
      "id": "5152348659c79f024059c3e44c5a276d4840f00102f9011f306a010000000092031653717561726520526f6765722d5374c3a97068616e65",
      "name": "Square Roger-Stéphane",
      "address": "Square Roger-Stéphane, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.8527844,
      "longitude": 2.3280131,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 895
    },
    {
      "id": "518e9470dac38e024059386d7dc2f46d4840f00102f90105bda104000000009203165371756172652053616d75656c20526f757373656175",
      "name": "Square Samuel Rousseau",
      "address": "Square Samuel Rousseau, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.8590285,
      "longitude": 2.3197082,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 29
    },
    {
      "id": "51545f57fac07c0240597e913bc6c16d4840f00102f90113ec2606000000009203185371756172652053616e746961676f206475204368696c69",
      "name": "Square Santiago du Chili",
      "address": "Square Santiago du Chili, 75007 Paris, France",
      "category": "parks",
      "latitude": 48.857613,
      "longitude": 2.3110603,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "openingHours": "May-Aug: Mo-Fr 08:00-20:30; May-Aug:Sa,Su,PH 09:00-20:30;Sep: Mo-Fr 08:00-19:30; Sep:Sa,Su,PH 09:00-19:30",
      "distance": 672
    },
    {
      "id": "517835b03f95a502405980926072636d4840f00102f901835bf80300000000920319537175617265205461726173732d43686576746368656e6b6f",
      "name": "Square Tarass-Chevtchenko",
      "address": "Square Tarass-Chevtchenko, 75006 Paris, France",
      "category": "parks",
      "latitude": 48.8545973,
      "longitude": 2.3307756,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France",
      "distance": 919
    }
  ],
  "city": {
    "name": "Paris, France",
    "latitude": 48.8588897,
    "longitude": 2.320041
  },
  "resolvedState": "Ile-de-France",
  "meta": {
    "limit": 100,
    "count": 100,
    "within": null,
    "distanceFrom": "city center",
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

## 18. GET /api/places?city=Paris%2C+Ile-de-France%2C+France&country=in&cityId=517808e3a7718f024059852f0219f06d4840f00101f901141d000000000000c002059203055061726973

HTTP 400

```json
{
  "error": {
    "code": "CITY_COUNTRY_MISMATCH",
    "message": "Choose a city in the selected country."
  }
}
```

## 19. GET /api/cities?country=jp&q=Tok

HTTP 200

```json
{
  "cities": [
    {
      "id": "51cf424cd37178614059d0bb0c5aa3d64140f00103f90144ddcb0f00000000c00208920305546f6b796f",
      "name": "Tokyo",
      "label": "Tokyo, Japan",
      "country": "jp"
    },
    {
      "id": "5120178b95076f6140596a9d5d633ce64140f00101f90151fb1a0000000000c0020892030a546f6b6f726f7a617761",
      "name": "Tokorozawa",
      "label": "Tokorozawa, Japan",
      "country": "jp"
    },
    {
      "id": "51b749a01ce01c61405998e8e225ee824140f00103f9013455ea2100000000c00208920305546f6b6169",
      "name": "Tokai",
      "label": "Tokai, Japan",
      "country": "jp"
    },
    {
      "id": "51e97fb9162d586140598718af7955904240f00103f90168b1d82c00000000c00208920309546f6b616d61636869",
      "name": "Tokamachi",
      "label": "Tokamachi, Japan",
      "country": "jp"
    },
    {
      "id": "5104b463d9c2d1604059de605e36f0084140f00103f9015918b10f00000000c00208920309546f6b757368696d61",
      "name": "Tokushima",
      "label": "Tokushima, Japan",
      "country": "jp"
    },
    {
      "id": "51828fc18ad31a61405913ee9579ab724140f00103f9012455ea2100000000c00208920308546f6b6f6e616d65",
      "name": "Tokoname",
      "label": "Tokoname, Japan",
      "country": "jp"
    }
  ]
}
```

## 20. GET /api/cities?country=jp&q=Tok

HTTP 200

```json
{
  "cities": [
    {
      "id": "51cf424cd37178614059d0bb0c5aa3d64140f00103f90144ddcb0f00000000c00208920305546f6b796f",
      "name": "Tokyo",
      "label": "Tokyo, Japan",
      "country": "jp"
    },
    {
      "id": "5120178b95076f6140596a9d5d633ce64140f00101f90151fb1a0000000000c0020892030a546f6b6f726f7a617761",
      "name": "Tokorozawa",
      "label": "Tokorozawa, Japan",
      "country": "jp"
    },
    {
      "id": "51b749a01ce01c61405998e8e225ee824140f00103f9013455ea2100000000c00208920305546f6b6169",
      "name": "Tokai",
      "label": "Tokai, Japan",
      "country": "jp"
    },
    {
      "id": "51e97fb9162d586140598718af7955904240f00103f90168b1d82c00000000c00208920309546f6b616d61636869",
      "name": "Tokamachi",
      "label": "Tokamachi, Japan",
      "country": "jp"
    },
    {
      "id": "5104b463d9c2d1604059de605e36f0084140f00103f9015918b10f00000000c00208920309546f6b757368696d61",
      "name": "Tokushima",
      "label": "Tokushima, Japan",
      "country": "jp"
    },
    {
      "id": "51828fc18ad31a61405913ee9579ab724140f00103f9012455ea2100000000c00208920308546f6b6f6e616d65",
      "name": "Tokoname",
      "label": "Tokoname, Japan",
      "country": "jp"
    }
  ]
}
```

## 21. GET /api/places?city=Tokyo%2C+Japan&country=jp&cityId=51cf424cd37178614059d0bb0c5aa3d64140f00103f90144ddcb0f00000000c00208920305546f6b796f&category=museums%2Cparks&sort=name

HTTP 200

```json
{
  "places": [
    {
      "id": "513e99daad80786140592098a3c7efd54140f00103f90163ba34640200000092031941727420417175617269756d204d757365756d2047494e5a41",
      "name": "Art Aquarium Museum GINZA",
      "address": "Art Aquarium Museum GINZA, 16, Ginza, Chuo, Ginza 4 104-8212, Japan",
      "category": "museums",
      "latitude": 35.67138,
      "longitude": 139.7657079,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://artaquarium.jp/",
      "phone": "+81-3-3528-6721",
      "openingHours": "Mo-Su,PH 10:00-19:00; Dec 31 10:00-17:30; Jan 01 off",
      "distance": 631
    },
    {
      "id": "51676fdf59b17861405985d21742ced64140f00103f901aaa805f9020000009203154372656174697665204d757365756d20546f6b796f",
      "name": "Creative Museum Tokyo",
      "address": "Creative Museum Tokyo, Chuo-dori Avenue, Kyōbashi, Chuo, Kyobashi 1 104-0031, Japan",
      "category": "museums",
      "latitude": 35.6781695,
      "longitude": 139.7716493,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.creative-museum.tokyo/",
      "distance": 715
    },
    {
      "id": "514e1641ef89786140597298959a4fd54140f00102f901f12f2e2100000000",
      "name": "Ginza",
      "address": "Ginza, Chuo, 104-0061, Japan",
      "category": "parks",
      "latitude": 35.666493,
      "longitude": 139.7668368,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1183
    },
    {
      "id": "51fc60cf8d9f78614059e6f3401a04d74140f00103f901149e43ae0200000092030e48414e4153414b41205354414e44",
      "name": "HANASAKA STAND",
      "address": "HANASAKA STAND, 1, Yaesu, Chuo, Yaesu 2 104-0028, Japan",
      "category": "museums",
      "latitude": 35.6798127,
      "longitude": 139.7694768,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.yanmar.com/jp/about/hanasaka/#hanasaka-stand",
      "distance": 602
    },
    {
      "id": "51a08b9608a078614059145d8010c8d64140f00102f9010b821e1b00000000",
      "name": "Kyōbashi",
      "address": "Kyōbashi, Chuo, 104-0031, Japan",
      "category": "parks",
      "latitude": 35.6779848,
      "longitude": 139.7695236,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 524
    },
    {
      "id": "516fdd8b4aa078614059d28ef3a971d64140f00102f9013e730707000000009203144c4958494ce382aee383a3e383a9e383aae383bc",
      "name": "LIXILギャラリー",
      "address": "LIXIL Gallery, Kyobashi Takegashi-dori Street, Kyōbashi, Chuo, Kyobashi 3 104-0031, Japan",
      "category": "museums",
      "latitude": 35.675343,
      "longitude": 139.7695276,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://livingculture.lixil.com/gallery/",
      "distance": 536
    },
    {
      "id": "51e692aaed66786140591f57d92db8d54140f00103f901de3c3dc20000000092031e4d4d4d204d6169736f6e20646573204d7573656573206475204d6f6e6465",
      "name": "MMM Maison des Musees du Monde",
      "address": "Ghinza Graphic Gallery, Ginza Suzuran Street, Ginza, Chuo, Ginza 7 104-0061, Japan",
      "category": "museums",
      "latitude": 35.6696832,
      "longitude": 139.7625645,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.mmm-ginza.org/top.html",
      "distance": 807
    },
    {
      "id": "510d1e81eb9b78614059f869c86b17d84140f00102f901c4877f0500000000",
      "name": "Nihonbashi Hongoku-chō",
      "address": "Nihonbashi Hongoku-chō, Chuo, 103-0021, Japan",
      "category": "parks",
      "latitude": 35.6882443,
      "longitude": 139.769012,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1348
    },
    {
      "id": "516f884c54ca7861405909efbc9ef9d74140f00103f9016a50eac602000000",
      "name": "Nihonbashi muromachi",
      "address": "Nihonbashi muromachi, Chuo, 103-0022, Japan",
      "category": "parks",
      "latitude": 35.6873053,
      "longitude": 139.7746984,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1517
    },
    {
      "id": "511eac5b9c7c78614059e916565ac0d74140f00102f901885e4a21000000009203084f4f54454d4f5249",
      "name": "OOTEMORI",
      "address": "Otemori, Ōtemachi, Chiyoda, 100-0004, Japan",
      "category": "parks",
      "latitude": 35.6855905,
      "longitude": 139.7652076,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 978
    },
    {
      "id": "514fc939b1477861405946dbe7e73cd84140f00103f9013a77d3370300000092030e706174696f2063617374696c6c6f",
      "name": "patio castillo",
      "address": "patio castillo, Chiyoda, 102-0000, Japan",
      "category": "parks",
      "latitude": 35.6893587,
      "longitude": 139.7587515,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 1465
    },
    {
      "id": "516810b0645b786140593ba01dbf67d54140f00102f901e207675700000000",
      "name": "Shinbashi",
      "address": "Shinbashi, Minato, 105-0004, Japan",
      "category": "parks",
      "latitude": 35.6672347,
      "longitude": 139.7611562,
      "city": "Minato",
      "state": null,
      "country": "Japan",
      "distance": 1099
    },
    {
      "id": "5125a9302500796140599b27176467d64140f00102f9017780502600000000",
      "name": "Shinkawa",
      "address": "Shinkawa, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6750325,
      "longitude": 139.7812734,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1583
    },
    {
      "id": "51a088b2980479614059fd937b2f2dd64140f00102f9012ff1002400000000",
      "name": "Shinkawa",
      "address": "Shinkawa, Chuo, Japan",
      "category": "parks",
      "latitude": 35.673267,
      "longitude": 139.7818322,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1669
    },
    {
      "id": "51487f1981d178614059cd70981c2ed64140f00102f901e559d72300000000",
      "name": "Shintomi",
      "address": "Shintomi, Chuo, 104-0041, Japan",
      "category": "parks",
      "latitude": 35.6732832,
      "longitude": 139.7755741,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1127
    },
    {
      "id": "51592fe13aa57861405948f4b77498d74140f00102f901ca2b9d5000000000920310546f6b796f20546f726368205061726b",
      "name": "Tokyo Torch Park",
      "address": "Tokyo Torch Park, Ōtemachi, Chiyoda, 100-0004, Japan",
      "category": "parks",
      "latitude": 35.6843401,
      "longitude": 139.7701697,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 1006
    },
    {
      "id": "516dfc14899178614059760a83aa5fd54140f00102f901eb2f2e2100000000",
      "name": "Tsukiji",
      "address": "Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6670095,
      "longitude": 139.7677877,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1150
    },
    {
      "id": "513bba45449378614059ed0274c160d54140f00102f901ed2f2e2100000000",
      "name": "Tsukiji",
      "address": "Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6670207,
      "longitude": 139.7679712,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1154
    },
    {
      "id": "51867f754c9878614059db219e4a5ad54140f00102f9018a83ec2000000000",
      "name": "Tsukiji",
      "address": "Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6668161,
      "longitude": 139.7685929,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1195
    },
    {
      "id": "51ad6abf0996786140594424a60c56d54140f00102f901ef2f2e2100000000",
      "name": "Tsukiji",
      "address": "Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.666692,
      "longitude": 139.7683116,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1199
    },
    {
      "id": "5121479cd084786140591b2bd1db34d54140f00102f901ac87d42200000000",
      "name": "Tsukiji",
      "address": "Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6656905,
      "longitude": 139.7661978,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1259
    },
    {
      "id": "517919e655cf786140597cef2f19bcd54140f00102f9018191102500000000",
      "name": "Tsukiji",
      "address": "Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.669735,
      "longitude": 139.7753827,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1306
    },
    {
      "id": "518693acbd28786140594c0b48f1c7d54140f00102f9011e28c92200000000",
      "name": "Uchisaiwaichō",
      "address": "Uchisaiwaichō, Chiyoda, 100-0011, Japan",
      "category": "parks",
      "latitude": 35.6701643,
      "longitude": 139.7549729,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 1097
    },
    {
      "id": "51a3013915bb78614059db7c48a38dd74140f00102f901a0862e0b00000000",
      "name": "Yaesu",
      "address": "Yaesu, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6840105,
      "longitude": 139.7728389,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1133
    },
    {
      "id": "51e8f9d346b578614059ab984a3fe1d64140f00103f9014ae6f00e0000000092031be382a2e383bce38386e382a3e382bee383b3e7be8ee8a193e9a4a8",
      "name": "アーティゾン美術館",
      "address": "Artizon Museum, 2, Kyōbashi, Chuo, Kyobashi 1 104-0031, Japan",
      "category": "museums",
      "latitude": 35.678749,
      "longitude": 139.7721285,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.artizon.museum/",
      "openingHours": "Tu-Sa 10:00-20:00; Su 10:00-18:00",
      "distance": 773
    },
    {
      "id": "51bddbc446d77861405900a9e6b84ad54140f00101f9017b46a40000000000920312e38182e3818be381a4e3818de585ace59c92",
      "name": "あかつき公園",
      "address": "Akatsuki Park, Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6661816,
      "longitude": 139.7767254,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1659
    },
    {
      "id": "518742ba8e6778614059cfbaeb110fd54140f00103f90109d6831201000000920321e382a2e38389e383bbe3839fe383a5e383bce382b8e382a2e383a0e69db1e4baac",
      "name": "アド・ミュージアム東京",
      "address": "Advertising Museum Tokyo, 2, Higashi Shinbashi, Minato, Higashi-Shinbashi 1 105-7090, Japan",
      "category": "museums",
      "latitude": 35.6645224,
      "longitude": 139.7626413,
      "city": "Minato",
      "state": null,
      "country": "Japan",
      "website": "https://www.admt.jp/",
      "phone": "+81 3-6218-2500",
      "openingHours": "Tu-Sa 12:00-18:00",
      "distance": 1377
    },
    {
      "id": "51c3d5011077786140590c9d8d4b0bd74140f00103f90143aba9fe0000000092031ee382a4e383b3e382bfe383bce383a1e38387e382a3e382a2e38386e382af",
      "name": "インターメディアテク",
      "address": "Intermediatheque, JP Tower 1F (Ground Floor), Marunouchi, Chiyoda, Marunouchi 2 100-0005, Japan",
      "category": "museums",
      "latitude": 35.6800322,
      "longitude": 139.764534,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "http://www.intermediatheque.jp/",
      "openingHours": "11:00-18:00; Fr,Sa 11:00-20:00; Mo closed",
      "distance": 357
    },
    {
      "id": "51ad4b32175d78614059923eada23fd54140f00103f9011a43a5210300000092031ee3818ae88cb6e381aee69687e58c96e589b5e980a0e58d9ae789a9e9a4a8",
      "name": "お茶の文化創造博物館",
      "address": "Ocha Culture Creation Museum, Showa-dori, Higashi Shinbashi, Minato, Higashi-Shinbashi 1 105-0021, Japan",
      "category": "museums",
      "latitude": 35.6660045,
      "longitude": 139.7613636,
      "city": "Minato",
      "state": null,
      "country": "Japan",
      "website": "https://www.ochamuseum.jp/",
      "distance": 1229
    },
    {
      "id": "51ac68bd297678614059da626d4210d64140f00103f9017e88fd240200000092031ee382bbe382a4e382b3e383bce3839fe383a5e383bce382b8e382a2e383a0",
      "name": "セイコーミュージアム",
      "address": "Seiko Museum, Namiki-dori Street, Ginza, Chuo, Ginza 4 104-0061, Japan",
      "category": "museums",
      "latitude": 35.6723712,
      "longitude": 139.7644242,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://museum.seiko.co.jp",
      "distance": 501
    },
    {
      "id": "51282d5c5661786140596b6116da39d54140f00103f9016079af5400000000920321e38391e3838ae382bde3838be38383e382afe6b190e79599e7be8ee8a193e9a4a8",
      "name": "パナソニック汐留美術館",
      "address": "Panasonic Shiodome Museum of Art, 1, Higashi Shinbashi, Minato, Higashi-Shinbashi 1 105-8301, Japan",
      "category": "museums",
      "latitude": 35.665828,
      "longitude": 139.761882,
      "city": "Minato",
      "state": null,
      "country": "Japan",
      "website": "https://panasonic.co.jp/ew/museum/",
      "openingHours": "Tu-Su 10:00-18:00",
      "distance": 1240
    },
    {
      "id": "5188669e5c9378614059c6f253c14dd64140f00103f9012a34ab330100000092032ce3839de383bce383a920e3839fe383a5e383bce382b8e382a2e383a020e382a2e3838de38383e382afe382b9",
      "name": "ポーラ ミュージアム アネックス",
      "address": "Pola Museum Annex, Ginza-itchome, Ginza, Chuo, Ginza 1 104-0061, Japan",
      "category": "museums",
      "latitude": 35.6742479,
      "longitude": 139.7679885,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.po-holdings.co.jp/m-annex/",
      "openingHours": "Mo-Su 11:00-20:00",
      "distance": 470
    },
    {
      "id": "519f0c4405bd7861405941dd9b3aead74140f00103f9011f29af5400000000920315e4b889e4ba95e8a898e5bfb5e7be8ee8a193e9a4a8",
      "name": "三井記念美術館",
      "address": "Mitsui Memorial Museum, Nihonbashi muromachi, Chuo, Nihonbashi muromachi 2 103-0022, Japan",
      "category": "museums",
      "latitude": 35.6868356,
      "longitude": 139.7730738,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.mitsui-museum.jp/",
      "openingHours": "Tu-Su 10:00-17:00",
      "distance": 1385
    },
    {
      "id": "51d15fca04d9776140599043c8bb0dd74140f00102f9017812492100000000920312e4b889e5ae85e59d82e5b08fe585ace59c92",
      "name": "三宅坂小公園",
      "address": "三宅坂小公園, Chiyoda, 102-0000, Japan",
      "category": "parks",
      "latitude": 35.6801066,
      "longitude": 139.7452298,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 1724
    },
    {
      "id": "51803628507a78614059ff7d213f76d74140f00103f901192d072b03000000920325e4b889e88fb155464ae4bfa1e8a897e98a80e8a18c20e4bfa1e8a897e58d9ae789a9e9a4a8",
      "name": "三菱UFJ信託銀行 信託博物館",
      "address": "Mitsubishi UFJ Trust and Banking Museum, 5, Marunouchi, Chiyoda, Marunouchi 1 100-0005, Japan",
      "category": "museums",
      "latitude": 35.6832961,
      "longitude": 139.7649308,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://www.mitsubishi.com/ja/minikite/vol03.html",
      "distance": 722
    },
    {
      "id": "516fb460516c78614059137d2c2cd6d64140f00102f90147f93e120000000092030fe4b889e88fb1e4b880e58fb7e9a4a8",
      "name": "三菱一号館",
      "address": "Mitsubishi Ichigokan Museum, Daimyō Kōji, Marunouchi, Chiyoda, Marunouchi 2 100-0005, Japan",
      "category": "museums",
      "latitude": 35.6785728,
      "longitude": 139.7633877,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://mimt.jp/",
      "openingHours": "Sa-Su, Tu-Th 10:00-18:00; Fr,We[2] 10:00-20:00; Mo off",
      "distance": 196
    },
    {
      "id": "51e782442494786140591f4c8a8f4fd54140f00103f901e42baf5400000000920336e4b8ade5a4aee58cbae7ab8be7af89e59cb0e7a4bee4bc9ae69599e882b2e4bc9ae9a4a8e383bbe983b7e59c9fe8b387e69699e9a4a8",
      "name": "中央区立築地社会教育会館・郷土資料館",
      "address": "Tsukiji Local Museum, 補助第316号線, Tsukiji, Chuo, Tsukiji 4 104-0045, Japan",
      "category": "museums",
      "latitude": 35.6664905,
      "longitude": 139.7680837,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1214
    },
    {
      "id": "51633ec8959778614059ebce72a841d54140f00102f901eec1581e0000000092032ae4b8ade5a4aee58cbae7ab8be7af89e59cb0e7a4bee4bc9ae69599e882b2e4bc9ae9a4a8e585ace59c92",
      "name": "中央区立築地社会教育会館公園",
      "address": "Tsukiji Local Museum Park, Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6660685,
      "longitude": 139.7685039,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1270
    },
    {
      "id": "5158625408da78614059939856f954d54140f00103f901d02915d70000000092031be4b8ade5a4aee58cbae7ab8be983b7e59c9fe5a4a9e69687e9a4a8",
      "name": "中央区立郷土天文館",
      "address": "Chuo Ward Local History Museum, Seiruka-dori Street, Chuo, Akashi cho 104-8560, Japan",
      "category": "museums",
      "latitude": 35.6666557,
      "longitude": 139.7766153,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.city.chuo.lg.jp/bunkakankou/bunka/kyodoshiryokan/index.html",
      "distance": 1615
    },
    {
      "id": "51e03ce64dcf786140591d90847d3bd64140f00103f901b9f803020300000092031be4b8ade5a4aee58cbae7ab8be983b7e59c9fe8b387e69699e9a4a8",
      "name": "中央区立郷土資料館",
      "address": "Chuo Ward Local History Museum, 14, Shintomi, Chuo, Shintomi 1 104-0041, Japan",
      "category": "museums",
      "latitude": 35.6736905,
      "longitude": 139.7753057,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.library.city.chuo.tokyo.jp/contents?1&pid=11",
      "phone": "+81-3-35512151",
      "openingHours": "Mo-Sa 09:00-21:00; Su 09:00-17:00",
      "distance": 1089
    },
    {
      "id": "5178a506a6b07861405916ca961524d64140f00102f9019818540e0000000092030ce4baace6a98be585ace59c92",
      "name": "京橋公園",
      "address": "Kyobashi Park, Ginza, Chuo, 104-0061, Japan",
      "category": "parks",
      "latitude": 35.6729778,
      "longitude": 139.7715482,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 815
    },
    {
      "id": "518b04ae86df786140596c6006befdd74140f00103f90121a8a5dd02000000920324e4bc8ae5a0b4e4bb99e6b5aee4b896e7b5b5e3839fe383a5e383bce382b8e382a2e383a0",
      "name": "伊場仙浮世絵ミュージアム",
      "address": "Ibasen Ukiyo-e Museum, Miyuki-dori, Nihonbashi horidomecho, Chuo, Nihonbashi kobunacho 103-0012, Japan",
      "category": "museums",
      "latitude": 35.6874311,
      "longitude": 139.7772859,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.ibasen.co.jp/pages/gallery",
      "distance": 1687
    },
    {
      "id": "51794ca8bac778614059fde9c6359cd74140f00102f9015ca8bb2b0000000092030fe58583e6a899e381aee5ba83e5a0b4",
      "name": "元標の広場",
      "address": "元標の広場, Nihonbashi muromachi, Chuo, 103-0022, Japan",
      "category": "parks",
      "latitude": 35.6844352,
      "longitude": 139.774377,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1267
    },
    {
      "id": "51d122dbf9de78614059022379f8fcd64140f00102f9013468d33000000000920327e5859ce794bae383bbe88c85e5a0b4e794bae381bee381a1e3818be381a9e5b195e7a4bae9a4a8",
      "name": "兜町・茅場町まちかど展示館",
      "address": "Kabutochō Kayabachō Machikado Museum, 平成通り, Nihonbashi kayaba cho, Chuo, Nihonbashi kayaba cho 2 103-0026, Japan",
      "category": "museums",
      "latitude": 35.6795951,
      "longitude": 139.7772188,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1241
    },
    {
      "id": "51cb02379c83786140594a3fe1ec56d84140f00102f9011b37b00900000000920315e58685e7a59ee794b0e5b0bee5b68be585ace59c92",
      "name": "内神田尾嶋公園",
      "address": "内神田尾嶋公園, Uchikanda, Chiyoda, 102-0000, Japan",
      "category": "parks",
      "latitude": 35.6901527,
      "longitude": 139.7660657,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 1491
    },
    {
      "id": "51dea74f17ce78614059d47d00529bd74140f00103f9018e32af540000000092030fe587a7e381aee58d9ae789a9e9a4a8",
      "name": "凧の博物館",
      "address": "Kite Museum, 3, Nihonbashi muromachi, Chuo, Nihonbashi-Muromachi 1 103-0022, Japan",
      "category": "museums",
      "latitude": 35.6844275,
      "longitude": 139.7751576,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.taimeiken.co.jp/tako/index_t.htm",
      "phone": "+81 3 3275 2704",
      "openingHours": "Mo-Sa 11:00-17:00",
      "distance": 1320
    },
    {
      "id": "51f9117bfc1578614059be395ad349d54140f00102f901342805090000000092030ce58d97e6a19ce585ace59c92",
      "name": "南桜公園",
      "address": "Minamisakura Park, Nishi-Shinbashi, Minato, 105-0003, Japan",
      "category": "parks",
      "latitude": 35.6663027,
      "longitude": 139.7526758,
      "city": "Minato",
      "state": null,
      "country": "Japan",
      "distance": 1551
    },
    {
      "id": "51dd02fb46fe78614059efbb46191ed64140f00102f9012af100240000000092031be58d97e9ab98e6a98be58d97e8a5bfe58590e7aba5e9818ae59c92",
      "name": "南高橋南西児童遊園",
      "address": "南高橋南西児童遊園, Minato, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6727667,
      "longitude": 139.7810423,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1614
    },
    {
      "id": "518bfdb36a5a7861405954377fb479d74140f00102f901ede1592200000000920315e5928ce794b0e58089e599b4e6b0b4e585ace59c92",
      "name": "和田倉噴水公園",
      "address": "Wadakura Fountain Park, Chiyoda, 102-0000, Japan",
      "category": "parks",
      "latitude": 35.6832331,
      "longitude": 139.7609356,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 757
    },
    {
      "id": "51e27bda3ca9786140596984c83379d64140f00103f9016187af540000000092031be59bbde7ab8be698a0e794bbe382a2e383bce382abe382a4e38396",
      "name": "国立映画アーカイブ",
      "address": "National Film Archive of Japan, Kajibashi-dori Avenue, Kyōbashi, Chuo, Kyobashi 3 104-0031, Japan",
      "category": "museums",
      "latitude": 35.6755738,
      "longitude": 139.7706589,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.nfaj.go.jp/",
      "distance": 628
    },
    {
      "id": "51a9e03383dd786140593f9ba03f07d74140f00102f9017ac7440b0000000092030fe59d82e69cace794bae585ace59c92",
      "name": "坂本町公園",
      "address": "Sakamotocho Park, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6799053,
      "longitude": 139.7770437,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1235
    },
    {
      "id": "51e6d6d586bc786140592a07e45267d64140f00102f90179ff581a00000000920315e5a080e5b79de5bcbee6ada3e6a98be585ace59c92",
      "name": "堀川弾正橋公園",
      "address": "Horikawa Danjobashi Park, Hatchōbori, Chuo, 104-0032, Japan",
      "category": "parks",
      "latitude": 35.6750209,
      "longitude": 139.7730261,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 850
    },
    {
      "id": "513142f5852878614059be4d862edfd44140f00102f901526d05090000000092030ce5a1a9e9879ce585ace59c92",
      "name": "塩釜公園",
      "address": "塩釜公園, Shinbashi, Minato, 105-0004, Japan",
      "category": "parks",
      "latitude": 35.6630749,
      "longitude": 139.7549535,
      "city": "Minato",
      "state": null,
      "country": "Japan",
      "distance": 1733
    },
    {
      "id": "51ae0448007e78614059eb825afa2ed84140f00102f901ea759a1a00000000920315e5a4a7e6898be794bae5b79de7abafe7b791e98193",
      "name": "大手町川端緑道",
      "address": "Common Plaza, Ōtemachi, Chiyoda, 100-0004, Japan",
      "category": "parks",
      "latitude": 35.6891404,
      "longitude": 139.7638678,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 1366
    },
    {
      "id": "5129cfbc1c76786140592f14b01d8cd84140f00103f901e04caf5400000000920315e5a4a9e79086e382aee383a3e383a9e383aae383bc",
      "name": "天理ギャラリー",
      "address": "Tenri Gallery, 9, Kanda-Nishikicho, Chiyoda, 102-0000, Japan",
      "category": "museums",
      "latitude": 35.691776,
      "longitude": 139.764418,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://tokyotenrikyokan.co.jp/gallery/",
      "openingHours": "Mo-Fr 10:00-18:00; Sa-Su 10:00-16:00",
      "distance": 1659
    },
    {
      "id": "51d0affb144978614059db358d53e0d74140f00102f901a02eac080000000092031ce5aeaee58685e5ba8120e4b889e381aee4b8b8e5b09ae894b5e9a4a8",
      "name": "宮内庁 三の丸尚蔵館",
      "address": "Sannomaru Shozokan, Shiomizaka Slope, Chiyoda, Chiyoda 100-0001, Japan",
      "category": "museums",
      "latitude": 35.6865244,
      "longitude": 139.7589084,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://shozokan.nich.go.jp/",
      "openingHours": "Tu-Th, Su 09:30-16:30; Fr-Sa 09:30-19:30",
      "distance": 1165
    },
    {
      "id": "51880d66309a78614059ae72e00938d54140f00102f9018683ec200000000092030fe5b882e5a0b4e6a98be585ace59c92",
      "name": "市場橋公園",
      "address": "Ichibabashi Park, Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6657928,
      "longitude": 139.7687996,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1308
    },
    {
      "id": "51ba4f5de2a378614059a1a36a9116d84140f00102f9018fa6fe240000000092030ce5b8b8e79ba4e585ace59c92",
      "name": "常盤公園",
      "address": "常盤公園, Nihonbashi Hongoku-chō, Chuo, 103-0021, Japan",
      "category": "parks",
      "latitude": 35.6881961,
      "longitude": 139.769994,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1376
    },
    {
      "id": "5169febdeea378614059fd6134ccced74140f00102f901a7f8a8160000000092030fe5b8b8e79ba4e6a98be585ace59c92",
      "name": "常盤橋公園",
      "address": "Tokiwabashi Park, Ōtemachi, Chiyoda, 100-0004, Japan",
      "category": "parks",
      "latitude": 35.6859995,
      "longitude": 139.7699628,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 1155
    },
    {
      "id": "51c268b12af2786140597deb1b5c4ad74140f00102f9015ea8bb2b00000000920306e5ba83e5a0b4",
      "name": "広場",
      "address": "広場, Nihonbashi kayaba cho, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6819434,
      "longitude": 139.7795444,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1522
    },
    {
      "id": "517eaca4a3e777614059a45ec525d4d64140f00102f901e1bd59080000000092030fe686b2e694bfe8a898e5bfb5e9a4a8",
      "name": "憲政記念館",
      "address": "Parliamentary Museum, Route 4 Shinjuku Line, Nagatacho, Chiyoda, Nagatacho 1 100-0014, Japan",
      "category": "museums",
      "latitude": 35.6783317,
      "longitude": 139.7471008,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "http://www.shugiin.go.jp",
      "phone": "0335811651",
      "openingHours": "Mo-Su 09:30-17:00",
      "distance": 1526
    },
    {
      "id": "512a1ee566647861405993b8327516d64140f00102f9019c224f1f00000000920312e695b0e5af84e5b18be6a98be585ace59c92",
      "name": "数寄屋橋公園",
      "address": "Sukiyabashi Park, Ginza, Chuo, 104-0061, Japan",
      "category": "parks",
      "latitude": 35.6725374,
      "longitude": 139.7622623,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 503
    },
    {
      "id": "5120449d21bb78614059df971c3234d64140f00102f9016ee9381a00000000920315e696b0e98791e6a98be58590e7aba5e9818ae59c92",
      "name": "新金橋児童遊園",
      "address": "新金橋児童遊園, Shintomi, Chuo, 104-0041, Japan",
      "category": "parks",
      "latitude": 35.6734776,
      "longitude": 139.772844,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 892
    },
    {
      "id": "51a534f68014786140598ea4ee14bcd54140f00103f901ce94d70401000000920315e697a5e69cace381aee98592e68385e5a0b1e9a4a8",
      "name": "日本の酒情報館",
      "address": "Japan Sake and Shōchū Information Center, Sotobori-dori, Nishi-Shinbashi, Minato, Nishishinbashi 1-chome 105-0003, Japan",
      "category": "museums",
      "latitude": 35.6698023,
      "longitude": 139.7525029,
      "city": "Minato",
      "state": null,
      "country": "Japan",
      "website": "https://japansake.or.jp/",
      "phone": "+81 33519 2091",
      "distance": 1294
    },
    {
      "id": "51f69f90f8b0786140597cf1457bbcd74140f00103f9014c7a7b500000000092032ae697a5e69cace98a80e8a18ce98791e89e8de7a094e7a9b6e68980e8b2a8e5b9a3e58d9ae789a9e9a4a8",
      "name": "日本銀行金融研究所貨幣博物館",
      "address": "Bank of Japan Currency Museum, 1, Nihonbashi Hongoku-chō, Chuo, Nihonbashi motoishicho 1 103-0021, Japan",
      "category": "museums",
      "latitude": 35.6854395,
      "longitude": 139.7716029,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.imes.boj.or.jp/cm/",
      "openingHours": "Tu-Su 09:30-16:30",
      "distance": 1181
    },
    {
      "id": "511b29c8ae3178614059d42fa4573dd64140f00102f9018dc3aa080000000092030fe697a5e6af94e8b0b7e585ace59c92",
      "name": "日比谷公園",
      "address": "Hibiya Park, Chiyoda, 102-0000, Japan",
      "category": "parks",
      "latitude": 35.674041,
      "longitude": 139.7563205,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 753
    },
    {
      "id": "51235f53315f786140595d3123bc3dd54140f00103f901562bed3000000000920327e697a7e696b0e6a98be5819ce8bb8ae5a0b4e98984e98193e6adb4e58fb2e5b195e7a4bae5aea4",
      "name": "旧新橋停車場鉄道歴史展示室",
      "address": "Old Shimbashi Station Railway History Exhibition Hall, 3, Higashi Shinbashi, Minato, Higashi-Shinbashi 1 105-0021, Japan",
      "category": "museums",
      "latitude": 35.6659465,
      "longitude": 139.7616202,
      "city": "Minato",
      "state": null,
      "country": "Japan",
      "openingHours": "Tu-Su 11:00-18:00",
      "distance": 1231
    },
    {
      "id": "515a52639df3786140595a688e8d97d54140f00102f901eaf7fb4800000000920312e6988ee79fb3e58590e7aba5e585ace59c92",
      "name": "明石児童公園",
      "address": "明石児童公園, Chuo, Japan",
      "category": "parks",
      "latitude": 35.668639,
      "longitude": 139.7798114,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1704
    },
    {
      "id": "51ac22371e8778614059c0666fdf59d74140f00103f901b5019cbc00000000920327e69db1e4baace382b9e38386e383bce382b7e383a7e383b3e382aee383a3e383a9e383aae383bc",
      "name": "東京ステーションギャラリー",
      "address": "Tokyo Station Gallery, 1, Marunouchi, Chiyoda, Marunouchi 1 100-0005, Japan",
      "category": "museums",
      "latitude": 35.6824302,
      "longitude": 139.7664939,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "http://www.ejrcf.or.jp/gallery/",
      "openingHours": "Tu-Th 10:00-18:00, Fr 10:00-20:00, Sa-Su 10:00-18:00",
      "distance": 662
    },
    {
      "id": "5124d4f5f4de786140598f2ef51d3cd64140f00102f901bc4ba1230000000092030ce6a19ce5b79de585ace59c92",
      "name": "桜川公園",
      "address": "Sakuragawa Park, Irifune, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6736938,
      "longitude": 139.7772769,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1259
    },
    {
      "id": "51f497497dc778614059ae2a6c1537d64140f00102f901fa5ad72300000000920318e6a19ce6a98be58d97e69db1e58590e7aba5e9818ae59c92",
      "name": "桜橋南東児童遊園",
      "address": "桜橋南東児童遊園, Shintomi, Chuo, 104-0041, Japan",
      "category": "parks",
      "latitude": 35.6735557,
      "longitude": 139.7743518,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1014
    },
    {
      "id": "510d65987b3778614059026cb10b2bd54140f00102f901e83605090000000092030ce6a19ce794b0e585ace59c92",
      "name": "桜田公園",
      "address": "桜田公園, Shinbashi, Minato, 105-0004, Japan",
      "category": "parks",
      "latitude": 35.6654401,
      "longitude": 139.7567381,
      "city": "Minato",
      "state": null,
      "country": "Japan",
      "distance": 1425
    },
    {
      "id": "51b612b6f1b578614059d554c8340fd64140f00102f901399b4c1b00000000920315e6a593e5b79de696b0e5af8ce6a98be585ace59c92",
      "name": "楓川新富橋公園",
      "address": "楓川新富橋公園, Shintomi, Chuo, 104-0041, Japan",
      "category": "parks",
      "latitude": 35.6723623,
      "longitude": 139.7721931,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 901
    },
    {
      "id": "51117b57f392786140599012bbb6b7d54140f00103f901527d4fc70100000092031be6ad8ce8889ee4bc8ee5baa7e382aee383a3e383a9e383aae383bc",
      "name": "歌舞伎座ギャラリー",
      "address": "Kabukiza Gallery, 15, Ginza, Chuo, Ginza 4 104-0061, Japan",
      "category": "museums",
      "latitude": 35.669669,
      "longitude": 139.7679383,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.shochiku.co.jp/play/theater/kabukiza/ginza-kabukiza/gallery/",
      "distance": 879
    },
    {
      "id": "518d823bab2078614059a2e7bb00a0d64140f00103f901c6231a0203000000920315e6b395e58b99e58fb2e69699e5b195e7a4bae5aea4",
      "name": "法務史料展示室",
      "address": "Ministry of Justice Museum, 1, Kasumigaseki, Chiyoda, Kasumigaseki 1 100-0013, Japan",
      "category": "museums",
      "latitude": 35.6767579,
      "longitude": 139.7539879,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://www.moj.go.jp/ENGLISH/mojm-01.html",
      "distance": 895
    },
    {
      "id": "51415389d2fb786140594718d27db7d54140f00102f9015fa8bb2b00000000920313e6b98ae7acac32e58590e7aba5e9818ae59c92",
      "name": "湊第2児童遊園",
      "address": "湊第2児童遊園, Minato, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6696647,
      "longitude": 139.7807454,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1720
    },
    {
      "id": "513a61c4f3447861405998bde77a0ad74140f00101f9016c3236000000000092030ce79a87e5b185e5a496e88b91",
      "name": "皇居外苑",
      "address": "Chiyoda, Kokyo Gaien National Garden 100-0002, Japan",
      "category": "parks",
      "latitude": 35.679944,
      "longitude": 139.758466,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "distance": 598
    },
    {
      "id": "51fbbb44314078614059ceb71c2209d74140f00102f901daea41280000000092030ce79a87e5b185e5a496e88b91",
      "name": "皇居外苑",
      "address": "Kokyo Gaien National Garden, Chiyoda, 102-0000, Japan",
      "category": "parks",
      "latitude": 35.6800544,
      "longitude": 139.7578546,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://fng.or.jp/koukyo/",
      "distance": 651
    },
    {
      "id": "51f235e5e53b78614059ac5f1f17e9d74140f00101f901e2a152000000000092030fe79a87e5b185e69db1e5bea1e88b91",
      "name": "皇居東御苑",
      "address": "Imperial Palace East Gardens, Chiyoda, 102-0000, Japan",
      "category": "parks",
      "latitude": 35.6867006,
      "longitude": 139.7573959,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://www.kunaicho.go.jp/event/higashigyoen/higashigyoen.html",
      "openingHours": "Mar 01-Apr 14 Tu-Th,Sa-Su 09:00-17:00; Apr 15-Aug 31 Tu-Th,Sa-Su 09:00-18:00; Sep Tu-Th,Sa-Su 09:00-17:00; Oct Tu-Th,Sa-Su 09:00-16:30; Nov 01-Feb 29 Tu-Th,Sa-Su 09:00-16:00; Dec 28-Jan 03 off; Feb 23 off; Mo,Fr off",
      "distance": 1242
    },
    {
      "id": "518bf95ee8767861405967adb200b7d64140f00103f901605d90da00000000920318e79bb8e794b0e381bfe381a4e38292e7be8ee8a193e9a4a8",
      "name": "相田みつを美術館",
      "address": "Mitsuo Aida Museum, 1, Marunouchi, Chiyoda, Marunouchi 3 100-0005, Japan",
      "category": "museums",
      "latitude": 35.6774598,
      "longitude": 139.7645151,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://www.mitsuo.co.jp/museum/index.html",
      "phone": "+81 3-5675-6521",
      "openingHours": "Tu-Su 10:00-17:30",
      "distance": 87
    },
    {
      "id": "51c1374d9f5d786140592005f467e4d54140f00103f90110beab3301000000920309e7a78be88fafe6b49e",
      "name": "秋華洞",
      "address": "Gallery Shukado, Sotobori-dori Avenue, Ginza, Chuo, Ginza 6 104-0061, Japan",
      "category": "museums",
      "latitude": 35.6710329,
      "longitude": 139.7614285,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.syukado.jp/",
      "openingHours": "Mo-Sa 10:00-18:00; Su 11:00-18:00",
      "distance": 685
    },
    {
      "id": "515c806c48d2786140594310316f1fd84140f00103f9010024336701000000920327e7acace4b880e4b889e585b1e3818fe38199e3828ae3839fe383a5e383bce382b8e382a2e383a0",
      "name": "第一三共くすりミュージアム",
      "address": "Daiichi Sankyo Kusuri Museum, Showa-dori Avenue, Nihonbashi honcho, Chuo, Nihonbashi honcho 3 103-0023, Japan",
      "category": "museums",
      "latitude": 35.6884593,
      "longitude": 139.7756693,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://kusuri-museum.com/",
      "distance": 1672
    },
    {
      "id": "51f170e55dac786140592f437e07d2d54140f00102f9012947dd0400000000920318e7af89e59cb0e5b79de4ba80e4ba95e6a98be585ace59c92",
      "name": "築地川亀井橋公園",
      "address": "Tsukijigawa Kameibashi Park, Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6704658,
      "longitude": 139.7710361,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 960
    },
    {
      "id": "51acc6740ec878614059696163f86ed54140f00101f9019d0076000000000092030fe7af89e59cb0e5b79de585ace59c92",
      "name": "築地川公園",
      "address": "Tsukijigawa park, Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6680887,
      "longitude": 139.7748213,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1388
    },
    {
      "id": "51a1cf836282786140591703fc0f2cd54140f00102f9015feeba0f00000000920318e7af89e59cb0e5b79de58d83e4bba3e6a98be585ace59c92",
      "name": "築地川千代橋公園",
      "address": "築地川千代橋公園, Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6653327,
      "longitude": 139.7660009,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1296
    },
    {
      "id": "51c5268f54a3786140593ce78739b2d54140f00102f9012747dd0400000000920315e7af89e59cb0e5b79de7a59de6a98be585ace59c92",
      "name": "築地川祝橋公園",
      "address": "Tsukijigawa Iwaibashi Park, Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.6693874,
      "longitude": 139.7699188,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 993
    },
    {
      "id": "51cda4acda8d78614059bcae04936cd54140f00102f901476bcf0a00000000920318e7af89e59cb0e5b79de98787e5a5b3e6a98be585ace59c92",
      "name": "築地川采女橋公園",
      "address": "Tsuijigawa Park (Uneme bridge), Ginza, Chuo, 104-0061, Japan",
      "category": "parks",
      "latitude": 35.6674247,
      "longitude": 139.7672949,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1093
    },
    {
      "id": "516e54a9729a786140597a3ee49a95d54140f00102f90173a5490a00000000920315e7af89e59cb0e5b79de98a80e5baa7e585ace59c92",
      "name": "築地川銀座公園",
      "address": "Tsukiji River Ginza Park, Tsukiji, Chuo, 104-0045, Japan",
      "category": "parks",
      "latitude": 35.668628,
      "longitude": 139.7688535,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1019
    },
    {
      "id": "51b7e50a569078614059373922e278d64140f00102f901383f080700000000920315e7b4bae5b18be6a98be58590e7aba5e9818ae59c92",
      "name": "紺屋橋児童遊園",
      "address": "紺屋橋児童遊園, Yaesu, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6755609,
      "longitude": 139.7676185,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 366
    },
    {
      "id": "5111ac055192786140596bf4c53945d84140f00103f901e968cc170300000092031be7b5b6e6bb85e383a1e38387e382a3e382a2e58d9ae789a9e9a4a8",
      "name": "絶滅メディア博物館",
      "address": "Extinct Media Museum, 6, Uchikanda, Chiyoda, Uchikanda 2 101-0047, Japan",
      "category": "museums",
      "latitude": 35.6896126,
      "longitude": 139.7678609,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://extinct-media-museum.blog.jp/",
      "phone": "+81 3-5256-5700",
      "distance": 1463
    },
    {
      "id": "5156458bc1c578614059e427a41085d74140f00102f9015ba8bb2b0000000092030ce88ab1e381aee5ba83e5a0b4",
      "name": "花の広場",
      "address": "花の広場, Nihonbashi, Chuo, 103-0027, Japan",
      "category": "parks",
      "latitude": 35.6837768,
      "longitude": 139.7741488,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1204
    },
    {
      "id": "51dea69545c578614059380dcd8e8dd64140f00102f90177ff581a00000000920318e8a5bfe585abe4b881e5a080e58590e7aba5e9818ae59c92",
      "name": "西八丁堀児童遊園",
      "address": "西八丁堀児童遊園, Hatchōbori, Chuo, 104-0032, Japan",
      "category": "parks",
      "latitude": 35.676195,
      "longitude": 139.774081,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 923
    },
    {
      "id": "51f15a536aa0786140590a8222716ad64140f00102f9015e8f310b0000000092030fe8ada6e5af9fe58d9ae789a9e9a4a8",
      "name": "警察博物館",
      "address": "Police Museum, Kyobashi Takegashi-dori Street, Kyōbashi, Chuo, Kyobashi 3 100-8929, Japan",
      "category": "museums",
      "latitude": 35.6751234,
      "longitude": 139.769582,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://www.keishicho.metro.tokyo.lg.jp/about_mpd/welcome/welcome/museum_tour.html",
      "phone": "+81335814321",
      "distance": 549
    },
    {
      "id": "51244d72766178614059a26eb1ec93d54140f00103f90162f73cc200000000920318e8b387e7949fe5a082e382aee383a3e383a9e383aae383bc",
      "name": "資生堂ギャラリー",
      "address": "Shiseido Gallery, Hanatsubaki-dori Street, Ginza, Chuo, Ginza 8 104-0061, Japan",
      "category": "museums",
      "latitude": 35.6685768,
      "longitude": 139.7618973,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "website": "https://gallery.shiseido.com/",
      "distance": 939
    },
    {
      "id": "51f447cacf0979614059f9228d1393d64140f00102f901d5c5a90a00000000920315e8b68ae5898de5a080e58590e7aba5e585ace59c92",
      "name": "越前堀児童公園",
      "address": "Echizembori Children's Playground, Shinkawa, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6763697,
      "longitude": 139.7824441,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1676
    },
    {
      "id": "5160ed768ff278614059173a345b05d64140f00102f9016b759b0e00000000920315e98984e7a0b2e6b4b2e58590e7aba5e585ace59c92",
      "name": "鉄砲洲児童公園",
      "address": "Teppōsu Playground Park, Minato, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6720145,
      "longitude": 139.7796086,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1518
    },
    {
      "id": "51d0909e6406796140595a5b8074f0d64140f00102f9014a7f5a2300000000920315e99c8ae5b2b8e6a98be58590e7aba5e9818ae59c92",
      "name": "霊岸橋児童遊園",
      "address": "霊岸橋児童遊園, Shinkawa, Chuo, Japan",
      "category": "parks",
      "latitude": 35.679211,
      "longitude": 139.7820296,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1659
    },
    {
      "id": "512f41576c5d7861405951d77f42e2d64140f00103f90121e89aa302000000920312e99d99e59889e5a082e7be8ee8a193e9a4a8",
      "name": "静嘉堂美術館",
      "address": "Seikado Bunko Art Museum, 1, Marunouchi, Chiyoda, Marunouchi 2 100-0005, Japan",
      "category": "museums",
      "latitude": 35.6787799,
      "longitude": 139.7614042,
      "city": "Chiyoda",
      "state": null,
      "country": "Japan",
      "website": "https://www.seikado.or.jp/",
      "openingHours": "Tu-Th, Sa-Su 10:00-17:00; Fr 10:00-18:00",
      "distance": 310
    },
    {
      "id": "51286398b5f8786140591093d2cf60d64140f00102f901c36f5a2300000000920318e9ab98e6a98be58c97e69db1e58590e7aba5e9818ae59c92",
      "name": "高橋北東児童遊園",
      "address": "高橋北東児童遊園, Shinkawa, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6748754,
      "longitude": 139.7803741,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1505
    },
    {
      "id": "518ec96472fa7861405923da704157d64140f00102f901c66f5a2300000000920318e9ab98e6a98be58d97e69db1e58590e7aba5e9818ae59c92",
      "name": "高橋南東児童遊園",
      "address": "高橋南東児童遊園, Shinkawa, Chuo, Japan",
      "category": "parks",
      "latitude": 35.6745089,
      "longitude": 139.7805629,
      "city": "Chuo",
      "state": null,
      "country": "Japan",
      "distance": 1528
    }
  ],
  "city": {
    "name": "Tokyo, Japan",
    "latitude": 35.6768601,
    "longitude": 139.7638947
  },
  "meta": {
    "limit": 100,
    "count": 100,
    "within": null,
    "distanceFrom": "city center",
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

## 22. GET /api/places/search?name=Eiffel+Tower

HTTP 200

```json
{
  "places": [
    {
      "id": "5112386d21235b024059effbdc75db6d4840f00102f901747f4c0000000000c0020192030c45696666656c20546f776572",
      "name": "Eiffel Tower",
      "address": "Eiffel Tower, 5 Avenue Anatole France, 75007 Paris, France",
      "category": "sights",
      "latitude": 48.8582599,
      "longitude": 2.2945006,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France"
    },
    {
      "id": "51d7a3703d0a0f5dc05909f9a067b3aa4940f00103f90139b34ba000000000c0020192030c45696666656c20546f776572",
      "name": "Eiffel Tower",
      "address": "Eiffel Tower, Improvement District No. 9, AB, Canada",
      "category": "parks",
      "latitude": 51.3336,
      "longitude": -116.235,
      "city": null,
      "state": "Alberta",
      "country": "Canada"
    }
  ],
  "query": "Eiffel Tower",
  "meta": {
    "limit": 20,
    "count": 2,
    "distanceFrom": null,
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

## 23. GET /api/places/search?name=Taj+Mahal

HTTP 200

```json
{
  "places": [
    {
      "id": "519fa7a6c9b182534059020ea14acd2c3b40f00102f901c1f95d1600000000c0020192030954616a204d6168616c",
      "name": "Taj Mahal",
      "address": "Taj Mahal, Taj East Gate Road, Taj Ganj, Agra - 282004, UP, India",
      "category": "sights",
      "latitude": 27.1750075,
      "longitude": 78.0421013,
      "city": "Agra",
      "state": "Uttar Pradesh",
      "country": "India"
    },
    {
      "id": "51d6cff6434782534059daad65321c2b3b40f00103f90198f63b9202000000c0020192030954616a204d6168616c",
      "name": "Taj Mahal",
      "address": "Taj Mahal, SH62, Taj Ganj, Agra - 282004, UP, India",
      "category": "other",
      "latitude": 27.168399,
      "longitude": 78.0355997,
      "city": "Agra",
      "state": "Uttar Pradesh",
      "country": "India"
    }
  ],
  "query": "Taj Mahal",
  "meta": {
    "limit": 20,
    "count": 2,
    "distanceFrom": null,
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

## 24. GET /api/places/search?name=zzzxxyyqqqnonexistentplace

HTTP 200

```json
{
  "places": [],
  "query": "zzzxxyyqqqnonexistentplace",
  "meta": {
    "limit": 20,
    "count": 0,
    "distanceFrom": null,
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

## 25. GET /api/places/search?name=Eifel+Tower

HTTP 200

```json
{
  "places": [
    {
      "id": "514b34924e6efd3a40598828cbb50db64840f00103f9019e09654b02000000c0020192030b456966656c20746f776572",
      "name": "Eifel tower",
      "address": "Eifel tower, Svobody Street, Поділ, Khmelnytskyi, 29001, Ukraine",
      "category": "sights",
      "latitude": 49.4222934,
      "longitude": 26.9899644,
      "city": "Khmelnytskyi",
      "state": "Khmelnytskyi Oblast",
      "country": "Ukraine"
    }
  ],
  "query": "Eifel Tower",
  "meta": {
    "limit": 20,
    "count": 1,
    "distanceFrom": null,
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

## 26. GET /api/places/search?name=Central+Park

HTTP 200

```json
{
  "places": [
    {
      "id": "51cf51a280c87d52c059a5daa7e331644440f00102f90128fe7f1900000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, New York, NY 11025, United States of America",
      "category": "parks",
      "latitude": 40.7827725,
      "longitude": -73.9653627,
      "city": "New York",
      "state": "New York",
      "country": "United States"
    },
    {
      "id": "51c295a24beec60ac059cdf56c0cf00d4c40f00102f9019bca830b00000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Chapel Street, Cowdenbeath, KY4 9QQ, United Kingdom",
      "category": "entertainment",
      "latitude": 56.1088882,
      "longitude": -3.3471342,
      "city": "Cowdenbeath",
      "state": "Scotland",
      "country": "United Kingdom"
    },
    {
      "id": "5122122add824958c059184cb2c4b9f24840f00102f90172dfe20000000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Downtown, Winnipeg, MB R3B 3B6, Canada",
      "category": "parks",
      "latitude": 49.8962942,
      "longitude": -97.1486123,
      "city": "Winnipeg",
      "state": "Manitoba",
      "country": "Canada"
    },
    {
      "id": "517dea58a5f49654c059bd361b2b31233740f00102f9016e446c0100000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Prado, Havana, Cuba",
      "category": "parks",
      "latitude": 23.137469,
      "longitude": -82.358682,
      "city": "Havana",
      "state": null,
      "country": "Cuba"
    },
    {
      "id": "5100e14389161855c05986f8d1ba57e24040f00102f901b6a1120200000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Old Fourth Ward, Atlanta, GA, United States of America",
      "category": "parks",
      "latitude": 33.7683023,
      "longitude": -84.3763755,
      "city": "Atlanta",
      "state": "Georgia",
      "country": "United States"
    },
    {
      "id": "512f0acc54d27055c0598feb95687f1d4340f00102f901fbb88c0300000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, 1340, Louisville, KY 40208, United States of America",
      "category": "parks",
      "latitude": 38.2304507,
      "longitude": -85.7628376,
      "city": "Louisville",
      "state": "Kentucky",
      "country": "United States"
    },
    {
      "id": "513f1d8f1928c15ec059ef39b01c219d4840f00102f901967b610100000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Metrotown, Burnaby, BC, Canada",
      "category": "parks",
      "latitude": 49.227573,
      "longitude": -123.0180725,
      "city": "Burnaby",
      "state": "British Columbia",
      "country": "Canada"
    },
    {
      "id": "51ce380d5185c05dc0597c5006fd3bb04140f00102f9011544950300000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Bakersfield, CA, United States of America",
      "category": "parks",
      "latitude": 35.3768307,
      "longitude": -119.008137,
      "city": "Bakersfield",
      "state": "California",
      "country": "United States"
    },
    {
      "id": "510fd253e4109910c059ad57ec8a74314940f00102f90194fbf30100000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Pennycross, Plymouth, ENG, United Kingdom",
      "category": "parks",
      "latitude": 50.3863691,
      "longitude": -4.1494785,
      "city": "Plymouth",
      "state": "England",
      "country": "United Kingdom"
    },
    {
      "id": "517a41fadcbf4808c059d817bfdf1eb54a40f00102f901293f370900000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Wallasey, CH44 0BS, United Kingdom",
      "category": "parks",
      "latitude": 53.4150047,
      "longitude": -3.0355222,
      "city": "Wallasey",
      "state": "England",
      "country": "United Kingdom"
    },
    {
      "id": "51b6ab4665f9ed55c059f5b5d37bcff04440f00101f901da3c370100000000c0020192030d4761726669656c64205061726b",
      "name": "Garfield Park",
      "address": "Garfield Park, 100, Chicago, IL 60624, United States of America",
      "category": "parks",
      "latitude": 41.8813319,
      "longitude": -87.7183469,
      "city": "Chicago",
      "state": "Illinois",
      "country": "United States"
    }
  ],
  "query": "Central Park",
  "meta": {
    "limit": 20,
    "count": 11,
    "distanceFrom": null,
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

## 27. GET /api/places/search?name=Central%20Park&sort=name&category=parks

HTTP 200

```json
{
  "places": [
    {
      "id": "51cf51a280c87d52c059a5daa7e331644440f00102f90128fe7f1900000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, New York, NY 11025, United States of America",
      "category": "parks",
      "latitude": 40.7827725,
      "longitude": -73.9653627,
      "city": "New York",
      "state": "New York",
      "country": "United States"
    },
    {
      "id": "5122122add824958c059184cb2c4b9f24840f00102f90172dfe20000000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Downtown, Winnipeg, MB R3B 3B6, Canada",
      "category": "parks",
      "latitude": 49.8962942,
      "longitude": -97.1486123,
      "city": "Winnipeg",
      "state": "Manitoba",
      "country": "Canada"
    },
    {
      "id": "517dea58a5f49654c059bd361b2b31233740f00102f9016e446c0100000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Prado, Havana, Cuba",
      "category": "parks",
      "latitude": 23.137469,
      "longitude": -82.358682,
      "city": "Havana",
      "state": null,
      "country": "Cuba"
    },
    {
      "id": "5100e14389161855c05986f8d1ba57e24040f00102f901b6a1120200000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Old Fourth Ward, Atlanta, GA, United States of America",
      "category": "parks",
      "latitude": 33.7683023,
      "longitude": -84.3763755,
      "city": "Atlanta",
      "state": "Georgia",
      "country": "United States"
    },
    {
      "id": "512f0acc54d27055c0598feb95687f1d4340f00102f901fbb88c0300000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, 1340, Louisville, KY 40208, United States of America",
      "category": "parks",
      "latitude": 38.2304507,
      "longitude": -85.7628376,
      "city": "Louisville",
      "state": "Kentucky",
      "country": "United States"
    },
    {
      "id": "513f1d8f1928c15ec059ef39b01c219d4840f00102f901967b610100000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Metrotown, Burnaby, BC, Canada",
      "category": "parks",
      "latitude": 49.227573,
      "longitude": -123.0180725,
      "city": "Burnaby",
      "state": "British Columbia",
      "country": "Canada"
    },
    {
      "id": "51ce380d5185c05dc0597c5006fd3bb04140f00102f9011544950300000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Bakersfield, CA, United States of America",
      "category": "parks",
      "latitude": 35.3768307,
      "longitude": -119.008137,
      "city": "Bakersfield",
      "state": "California",
      "country": "United States"
    },
    {
      "id": "510fd253e4109910c059ad57ec8a74314940f00102f90194fbf30100000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Pennycross, Plymouth, ENG, United Kingdom",
      "category": "parks",
      "latitude": 50.3863691,
      "longitude": -4.1494785,
      "city": "Plymouth",
      "state": "England",
      "country": "United Kingdom"
    },
    {
      "id": "517a41fadcbf4808c059d817bfdf1eb54a40f00102f901293f370900000000c0020192030c43656e7472616c205061726b",
      "name": "Central Park",
      "address": "Central Park, Wallasey, CH44 0BS, United Kingdom",
      "category": "parks",
      "latitude": 53.4150047,
      "longitude": -3.0355222,
      "city": "Wallasey",
      "state": "England",
      "country": "United Kingdom"
    },
    {
      "id": "51b6ab4665f9ed55c059f5b5d37bcff04440f00101f901da3c370100000000c0020192030d4761726669656c64205061726b",
      "name": "Garfield Park",
      "address": "Garfield Park, 100, Chicago, IL 60624, United States of America",
      "category": "parks",
      "latitude": 41.8813319,
      "longitude": -87.7183469,
      "city": "Chicago",
      "state": "Illinois",
      "country": "United States"
    }
  ],
  "query": "Central Park",
  "meta": {
    "limit": 20,
    "count": 10,
    "distanceFrom": null,
    "attribution": "Powered by Geoapify | © OpenStreetMap contributors"
  }
}
```

## 28. GET /api/places/5112386d21235b024059effbdc75db6d4840f00102f901747f4c0000000000c0020192030c45696666656c20546f776572

HTTP 200

```json
{
  "place": {
    "id": "5112386d21235b024059effbdc75db6d4840f00102f901747f4c0000000000c0020192030c45696666656c20546f776572",
    "name": "Tour Eiffel",
    "address": "Eiffel Tower, 5 Avenue Anatole France, 75007 Paris, France",
    "category": "sights",
    "latitude": 48.8582599,
    "longitude": 2.2945006,
    "city": "Paris",
    "state": "Ile-de-France",
    "country": "France",
    "website": "https://www.toureiffel.paris/",
    "openingHours": "09:30-23:45; Jun 21-Sep 2: 09:00-00:45; Jul 14,Jul 15 off"
  }
}
```

## 29. POST /api/itinerary

HTTP 201

```json
{
  "item": {
    "id": "e70c5dca-74a0-4ef7-93eb-1f0aa72ba941",
    "visitor_id": "4ad68bcd-9f87-4ebe-99c2-2d938caad0d8",
    "place_id": "5112386d21235b024059effbdc75db6d4840f00102f901747f4c0000000000c0020192030c45696666656c20546f776572",
    "name": "Tour Eiffel",
    "address": "Eiffel Tower, 5 Avenue Anatole France, 75007 Paris, France",
    "category": "sights",
    "latitude": 48.8582599,
    "longitude": 2.2945006,
    "created_at": "2026-10-18T17:57:01.75348+00:00",
    "day": null,
    "city": "Paris",
    "state": "Ile-de-France",
    "country": "France"
  }
}
```

## 30. GET /api/itinerary

HTTP 200

```json
{
  "items": [
    {
      "id": "e70c5dca-74a0-4ef7-93eb-1f0aa72ba941",
      "visitor_id": "4ad68bcd-9f87-4ebe-99c2-2d938caad0d8",
      "place_id": "5112386d21235b024059effbdc75db6d4840f00102f901747f4c0000000000c0020192030c45696666656c20546f776572",
      "name": "Tour Eiffel",
      "address": "Eiffel Tower, 5 Avenue Anatole France, 75007 Paris, France",
      "category": "sights",
      "latitude": 48.8582599,
      "longitude": 2.2945006,
      "created_at": "2026-10-18T17:57:01.75348+00:00",
      "day": null,
      "city": "Paris",
      "state": "Ile-de-France",
      "country": "France"
    }
  ]
}
```

## 31. DELETE /api/itinerary/e70c5dca-74a0-4ef7-93eb-1f0aa72ba941

HTTP 200

```json
{
  "deleted": "e70c5dca-74a0-4ef7-93eb-1f0aa72ba941"
}
```

## 32. GET /api/itinerary

HTTP 200

```json
{
  "items": []
}
```
