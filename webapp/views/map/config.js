// eslint-disable-next-line no-unused-vars
const services = [
  {
    layers: 'osm_waterways',
    format: 'image/png',
    transparent: true,
    maxZoom: 20,
    minZoom: 1,
    displayName: 'Waterways',
    type: 'vector',
    group: 'Basemap'
  },
  {
    layers: 'osm_roads',
    format: 'image/png',
    transparent: true,
    maxZoom: 20,
    minZoom: 1,
    displayName: 'Roads',
    type: 'vector',
    group: 'Basemap'
  },
  {
    layers: 'osm_buildings',
    format: 'image/png',
    transparent: true,
    maxZoom: 20,
    minZoom: 1,
    displayName: 'Buildings',
    type: 'vector',
    group: 'Basemap'
  },
  {
    layers: 'basemap_bbox',
    format: 'image/png',
    transparent: true,
    maxZoom: 20,
    minZoom: 1,
    displayName: 'Basemap boundary',
    type: 'vector',
    group: 'Basemap'
  },
  {
    layers: 'selection',
    format: 'image/png',
    transparent: true,
    maxZoom: 20,
    minZoom: 1,
    displayName: 'Current selection',
    type: 'vector',
    group: 'Basemap'
  },
  {
    layers: 'time_map_from_points',
    format: 'image/png',
    transparent: true,
    maxZoom: 20,
    minZoom: 3,
    displayName: 'Start point',
    type: 'vector',
    group: 'Time map'
  },
  {
    layers: 'time_map_via_points',
    format: 'image/png',
    transparent: true,
    maxZoom: 20,
    minZoom: 3,
    displayName: 'Via point',
    type: 'vector',
    group: 'Time map'
  },
  {
    layers: 'time_map_stricken_area',
    format: 'image/png',
    transparent: true,
    maxZoom: 20,
    minZoom: 3,
    displayName: 'Affected area',
    type: 'vector',
    group: 'Time map'
  },
  {
    layers: 'time_map_result',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    displayName: 'Road-level time map',
    type: 'raster',
    group: 'Time map'
  },
  {
    layers: 'bbswr_metropolitan_area',
    displayName: 'Metropolitan area',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_municipality',
    displayName: 'BMC administrative units',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slums',
    displayName: 'Informal settlements',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_land_ownership',
    displayName: 'Informal settlements: ownership',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slum_houses_total_population',
    displayName: 'Households by total population',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slum_houses_female_population',
    displayName: 'Households by female population',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slum_houses_male_population',
    displayName: 'Households by male population',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slum_houses_ownership',
    displayName: 'Households by type of ownership',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slum_houses_religion',
    displayName: 'Households by religion',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slum_houses_monthly_income',
    displayName: 'Households by average monthly income',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slum_houses_livestock',
    displayName: 'Households by livestock',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slum_houses_bathrooms',
    displayName: 'Households by availability of sanitation',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_slum_houses_toilets',
    displayName: 'Households by availability of latrines',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_empty_places',
    displayName: 'Open spaces/vacant land',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  {
    layers: 'bbswr_empty_places_ownership',
    displayName: 'Open spaces/vacant land: ownership',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Bhubaneswar thematic maps'
  },
  // Proposed CDP 203 GROUP Layers
  {
    layers: 'Proposed_CDP_2030_BMC_Landuse',
    displayName: 'Proposed CDP 2030',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Agriculture_Area',
    displayName: 'Agriculture',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Forest_Area',
    displayName: 'Forest',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Retail_Commercial_and_Bussiness_use_Zone',
    displayName: 'Retail Commercial and Bussiness use Zone',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Wholesale_Commercial_Use_Zone',
    displayName: 'Wholesale Commercial Use Zone',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Environmentally_Sensitive_Zone',
    displayName: 'Environmentally Sensitive Zone',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Industrial_Use_Zone',
    displayName: 'Industrial Use Zone',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Open_Space_Use_Zone',
    displayName: 'Open Space Use Zone',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
   {
    layers: 'Public_and_Semipublic_Use_Zone',
    displayName: 'Public and Semipublic Use Zone',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Residential_Use_Zone_Area',
    displayName: 'Residential Use Zone',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Protected_Monuments_and_Precincts_Area',
    displayName: 'Protected Monuments and Precinct',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Commercial_within_Special_Heritage_Zone_Area',
    displayName: 'Commercial within Special Heritage',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Public_and_Semi_public_within_Special_Heritage_Zone_Area',
    displayName: 'Public and Semipublic within Specia',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Residential_within_Special_Heritage_Zone_Area',
    displayName: 'Residential within Special Heritage',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Road_Area',
    displayName: 'Road',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Railways_Area',
    displayName: 'Railways',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Airport_CDP_Area',
    displayName: 'Airport',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Bus_Depots_Area',
    displayName: 'Bus Depots Truck Terminals',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Utility_and_Services_use_Zone',
    displayName: 'Utility and Services Use Zone',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Rivers_Canals_Stream_Area',
    displayName: 'Rivers Canals and Streams',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  {
    layers: 'Ponds_Lakes_Lagoons_Area',
    displayName: 'Ponds Lakes and Lagoons',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Proposed CDP 2030'
  },
  // Airport Authority of India Zone Map group Layers
  {
    layers: 'NOC_To_Be_Obtained_From_AAI',
    displayName: 'NOC To Be Obtained From AAI',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Airport Authority of India Zone Map'
  },
  {
    layers: 'Permissible_Top_Elevation_102M_AMSL',
    displayName: 'Permissible Top Elevation 102M AMSL',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Airport Authority of India Zone Map'
  },
  {
    layers: 'Permissible_Top_Elevation_122M_AMSL',
    displayName: 'Permissible Top Elevation 122M AMSL',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Airport Authority of India Zone Map'
  },
  {
    layers: 'Permissible_Top_Elevation_142M_AMSL',
    displayName: 'Permissible Top Elevation 142M AMSL',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Airport Authority of India Zone Map'
  },
  {
    layers: 'Permissible_Top_Elevation_82M_AMSL',
    displayName: 'Permissible Top Elevation 82M AMSL',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Airport Authority of India Zone Map'
  },
  //  Eco Sensitive Zone group layers 
  {
    layers: 'Chandaka_Damapara_Eco_Sensitive_Zone',
    displayName: 'Chandaka Dampara Eco Sensitive Zone',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Eco Sensitive Zone'
  },
  {
    layers: 'Nandankanan_Eco_Sensitive_Boundary',
    displayName: 'Nandankanan Eco-Sensitive Boundary',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Eco Sensitive Zone'
  },
  //Community Services/
    //---->Police Station group layers 

  {
    layers: 'Police_Stations',
    displayName: 'Police Station',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  {
    layers: 'Police_Out_Post',
    displayName: 'Police Out Post',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },

    //---> Post Office group layers 
  {
    layers: 'General_Post_Office',
    displayName: 'General Post Office',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  {
    layers: 'Branch_Post_Offices',
    displayName: 'Branch Post Office',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  {
    layers: 'Sub_Post_Offices',
    displayName: 'Sub Post Office',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  //Community Services 
  {
    layers: 'Banks',
    displayName: 'Bank',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services' 
  },
  {
    layers: 'Hotels',
    displayName: 'Hotel',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  {
    layers: 'Resturants',
    displayName: 'Restaurant',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  {
    layers: 'Petrol_Pumps',
    displayName: 'Petrol Pump',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  {
    layers: 'Community_Centers',
    displayName: 'Community Centre',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  {
    layers: 'Shopping_Places',
    displayName: 'Shopping Place',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  {
    layers: 'Fire_Stations',
    displayName: 'Fire Station',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  {
    layers: 'Telepohone_Exchange',
    displayName: 'Telephone Exchange',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Community Services'
  },
  //  Educational group layers
  {
    layers: 'University',
    displayName: 'University',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Educational'
  },
  {
    layers: 'School_OPEPA_DISE School_OPEPE_DISE',
    displayName: 'School (OPEPA DISE)',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Educational'
  },
  {
    layers: 'Colleges',
    displayName: 'College',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Educational'
  },
  {
    layers: 'Anganwadi_Centre',
    displayName: 'Anganwadi Centre',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Educational'
  },
  {
    layers: 'Learning_Point',
    displayName: 'Learning Point',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Educational'
  },
  {
    layers: 'Training_Institutes_Other',
    displayName: 'Training Institutes/Other',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Educational'
  },
  //Government Office group layers
  {
    layers: 'Central_Government_Offices',
    displayName: 'Central Government',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Government Office'
  },
  {
    layers: 'State_Government_Offices',
    displayName: 'State Government',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Government Office'
  },
  {
    layers: 'City_Level_Offices',
    displayName: 'City Level Office',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Government Office'
  },
  //  Health group layers
  {
    layers: 'Pvt_Health_Clinic',
    displayName: 'Clinic',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Health'
  },
  {
    layers: 'Pvt_Health_Clinic',
    displayName: 'Hospital',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Health'
  },
  {
    layers: 'Pvt._Nursing_Home_Pvt',
    displayName: 'Nursing Home',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Health'
  },
  {
    layers: 'Pvt_Health_Clinic',
    displayName: 'Other Health Facility',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'Health'
  },
  //  ASI Boundary group layers
  {
    layers: 'Protected_Area',
    displayName: 'Protected Area',
    format: 'image/png',
    transparent: true,
    legend: true,
    maxZoom: 20,
    minZoom: 1,
    type: 'vector',
    group: 'ASI Boundary'
  }
] 