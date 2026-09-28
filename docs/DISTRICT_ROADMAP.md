# Kerala district and travel roadmap

Proposed content, not an inventory of implemented scenes. The current app contains only backwater, Munnar-inspired and Kochi-inspired areas. Initial landmarks below are selections from the supplied brief; remaining named places remain later content, not silently completed features.

## Geographical organization

Use a narrow, curved north-to-south land form with the sea west and Ghats east. Place Wayanad inland east of the northern coast; Palakkad inland east of the central coast; Idukki east of Ernakulam/Kottayam; Pathanamthitta inland northeast of Kollam. Do not line all fourteen district hubs up on the coast. Layout is stylized, with representative corridors instead of every road or village.

The route graph is a gameplay network, not a claim that every connected hub is a direct real-world transit service. Validate exact boundaries, route labels and landmark placement against official maps before authored content release. A district's 2–6 first landmarks can span multiple chunks; do not load all of them together.

| Group / district | Main hub | Terrain and landmark composition: first 2–6 anchors | Social purpose / distinctive area | Initial travel links |
| --- | --- | --- | --- | --- |
| North · Kasaragod | Kasaragod town | Bekal Fort; Bekal Beach; Valiyaparamba; Ranipuram; Ananthapura Lake Temple; Madhur Temple | Sea-facing laterite fort walls/viewpoint; quiet backwater jetty | Kannur by coastal bus/rail |
| North · Kannur | Kannur town | St. Angelo Fort; Payyambalam; Muzhappilangad; Parassinikadavu; Theyyam-inspired cultural space; Aralam | Fort gathering, beach groups, carefully authored cultural square | Kasaragod/Kozhikode coastal route; Wayanad hill road |
| North · Wayanad | Kalpetta | Vythiri/Lakkidi; Edakkal Caves; Pookode Lake; Banasura Sagar; Soochipara; En Ooru-inspired heritage village | Forested upland valleys and waterfall gorge; mountain café and lake seats | Kozhikode via churam; Kannur/Malappuram hill roads |
| North · Kozhikode | Kozhikode city | Kozhikode Beach; Mananchira; Kappad; Beypore harbour; Kallai; Thamarassery Churam | Lived-in market streets and timber/harbour silhouettes; beach/café gatherings | Kannur/Malappuram bus/rail; Wayanad mountain route |
| North · Malappuram | Malappuram town | Kottakkunnu; Nilambur/Teak Museum; Conolly's Plot; Tirur/Thunchan Parambu; Adyanpara; Kadampuzha area | Rolling hills, rivers and teak canopy; Malabar tea shop and riverside gathering | Kozhikode/Thrissur coastal corridor; Wayanad/Palakkad inland roads |
| Central · Palakkad | Palakkad town | Palakkad Fort; Malampuzha/Garden; Nelliyampathy; Silent Valley; Parambikulam | Wide plains contrast with mountain walls; fort plaza and garden seats | Malappuram/Thrissur roads |
| Central · Thrissur | Thrissur town | Vadakkunnathan surroundings; Pooram-inspired event space; Kerala Kalamandalam; Guruvayur; Athirappilly; Punnathur Kotta-inspired area | Town-square scale and waterfall rock face; cultural gathering venue | Malappuram/Ernakulam bus/rail; Palakkad inland route |
| Central · Ernakulam | Kochi / Fort Kochi | Fort Kochi/fishing nets; Mattancherry/Jew Town; Marine Drive; Kumbalangi; Cherai | Narrow heritage streets, net structures and water edges; street café as first public gathering hub | Thrissur/Kottayam/Alappuzha bus/rail; Idukki mountain road |
| Central · Idukki | Munnar social hub | Tea plantations; Mattupetty; Top Station; Eravikulam region; Thekkady/Periyar; Idukki Dam | Steep slopes, contour tea rows, winding roads, mist; tea shop/viewpoint/camp rest | Ernakulam/Kottayam/Pathanamthitta mountain roads |
| Central · Kottayam | Kottayam town | Kumarakom; Vembanad Lake; Bird Sanctuary; Vaikom/temple area; rural villages; Illikkal Kallu-inspired heights | Low lake edge transitions to green uplands; Kumarakom seats and village tea shop | Ernakulam/Pathanamthitta road/rail; Alappuzha boat; Idukki hill road |
| Central · Alappuzha | Alappuzha town | Alappuzha Beach; canal/houseboat routes; Kuttanad; Marari; Krishnapuram Palace area | Water is the route structure: canals, paddy parcels, low bridges and village strips; social houseboat/quiet jetty | Kottayam by boat; Ernakulam/Kollam coastal route; Pathanamthitta inland road |
| South · Pathanamthitta | Pathanamthitta town | Aranmula heritage; Konni; Gavi; Perunthenaruvi; Pandalam; Sabarimala region | Riverbank villages and forest corridors; heritage gathering and forest rest point | Kottayam/Kollam/Alappuzha roads; Idukki hill road |
| South · Kollam | Kollam town | Ashtamudi; Munroe Island; Thangassery/Lighthouse; Jatayu area; Thenmala | Branching lake edge, island paths and coastal beacon; lakeside tea shop/jetty | Alappuzha/Thiruvananthapuram bus/rail; Pathanamthitta inland route |
| South · Thiruvananthapuram | Capital city | Padmanabhaswamy area; Napier Museum district; Kanakakkunnu; Kovalam; Shanghumukham; Neyyar | City streets/gardens, beach coves and eastern hills; café, promenade and garden gathering | Kollam bus/rail; local Neyyar hill route |

## Content release order

1. Reuse the three existing visual themes as starting asset kits. Establish Kochi café, Alappuzha jetty and Munnar viewpoint as three playable representative hubs; no need to erase the existing island during this work.
2. Add lightweight district manifests and hub chunks for the remaining eleven districts. Each gets arrival point, distinct terrain/silhouette, social anchor, collision and a return route. Catalog metadata alone does not count as an implemented district.
3. Add landmark chunks incrementally: Bekal/St. Angelo fort silhouettes, Kozhikode harbour/streets, Wayanad forest/waterfall, Palakkad plains/fort, Thrissur square, southern lake/river/city landscapes.
4. Expand the selected anchors and later brief locations only after streaming and frame-budget checks. Festivals and cultural areas receive separate content review.

## Recognition acceptance test

For each district, capture an arrival and a social-space view without district labels. Check whether terrain, built form, water/road layout and landmark silhouette distinguish it from the neighboring district. Ensure the social space has usable seats/table/chat purpose and visible people rather than inaccessible decoration. Verify travel in and out with two people and a mobile player; validate the chunk unload after departure.
