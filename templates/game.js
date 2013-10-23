/******************************************************************************
    The MIT License (MIT)

    Copyright (c) 2013, Aaron Meier

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE. 
 ******************************************************************************/

var active_tab = '';
var tmr = null;
var sec_tmr = null;
var save_tmr = null;
var last_save_tmr = null;
var stat_tmr = null;
var event_tmr = null;
var ver_tmr = null;
var last_tick = (new Date).getTime();
var last_save = (new Date).getTime();
var last_click = 0;
var last_bust = 0;
var last_float = 10;
var tick_ms = 100;
//var has_gaq = true;


function Game() { 

    var pd = {
        'title':'Clicking Bad',
        'version':'{{version}}',
        'make_amount':1,
        'make_rps_multiplier':0,
        'sell_amount':1,
        'sell_rps_multiplier':0,
        'sell_return':0.5,
        'economy_roi':1,
        'economy_rois':[
            {
                'roi':0.5,
                'label':'Poor',
            },
            {
                'roi':1,
                'label':'Average',
            },
            {
                'roi':1.5,
                'label':'Good',
            },
            {
                'roi':2,
                'label':'Very Good',
            },
        ],
        'difficulty_level':0,
        'difficulty_levels':[
            {
                'level':0,
                'label':'Default',
            },
            {
                'level':1,
                'label':'Hard',
            },
            {
                'level':2,
                'label':'Insane',
            },
        ],
        'risk_amount':0,
        'risk_levels':[
            {
                'level':0.0001,
                'label':'nearly impossible',
                'color':'green',
            },
            { 
                'level':0.005,
                'label':'super low',
                'color':'green',
            },
            {
                'level':0.05,
                'label':'very low',
                'color':'green'
            },
            {
                'level':0.2,
                'label':'low',
                'color':'green',
            },
            { 
                'level':0.35,
                'label':'moderate',
                'color':'orange',
            },
            {
                'level':0.50,
                'label':'high',
                'color':'red',
            },
            {   
                'level':0.7,
                'label':'very high',
                'color':'red',
            },
            {
                'level':0.9,
                'label':'nearly certain (!)',
                'color':'red',
            },
        ],
        'cash': {
            'amount':0,
            'safe':0, 
            'safe_rps':0,
            'label':'Cash Money',
            'action_label':'SELL!',
        },
        'widget_roi':0.5,
        'widgets':{
            'amount':0,
            'label':'Batches',
            'action_label':'COOK!',
            'qualities':{
                1: 'Deadly',
                2: 'Dangerous',
                4: 'Unhealthy',
                6: 'Cloudy',
                10: 'Poor',
                13: 'Average',
                16: 'Good',
                20: 'Crystal',
                25: 'Blue Gold',
                50: 'Blue Platinum',
                1000: 'FDA Approved Additive',
            },
        },

        // BANKS
        'banks':{
            'storage_1k':{
                'label':'Lock Box',
                'description':'Invest in a lock box to securely store $1K',
                'cash_protect':1000,
                'cash_protect_rps':0,
                'cost':10000,
                'purchased':false,
                'interest':0,
                'prereq':null,
            },
            'storage_10k':{
                'label':'Diaper Box',
                'description':'Invest in a diaper box to securely store $10K',
                'cash_protect':10000,
                'cash_protect_rps':0,
                'cost':100000,
                'purchased':false,
                'interest':0,
                'prereq':'storage_1k',
            },
            'storage_100k':{
                'label':'Duffle Bag',
                'description':'Invest in a duffle bag to securely store $100K',
                'cash_protect':100000,
                'cash_protect_rps':0,
                'cost':1000000,
                'purchased':false,
                'interest':0,
                'prereq':'storage_10k',
            },
            'storage_1m':{
                'label':'Banana Stand',
                'description':'Invest in a banana stand to launder $1M',
                'cash_protect':1000000,
                'cash_protect_rps':10,
                'cost':10000000,
                'purchased':false,
                'interest':0.01,
                'prereq':'storage_100k',
            },
            'storage_10m':{
                'label':'Chicken Restaurant',
                'description':'Invest in a fried chicken restaurant to safely launder $10M',
                'cash_protect':10000000,
                'cash_protect_rps':110,
                'cost':100000000,
                'purchased':false,
                'interest':0.02,
                'prereq':'storage_1m',
            },
        },

        // MANUFACTURING
        'clickers':{
            '01_storage_shed':{
                'label':'Storage Shed',
                'description':'A cheap shed with electricity',
                'amount':0,
                'risk':0.05,
                'rps':.2,
                'base_cost':20,
                'cost':20,
                'unlock_rps':0,
                'unlocked':true,
            },
            '03_used_rv':{
                'label':'Used RV',
                'description':'A low cost RV, perfect for remote cooking',
                'amount':0,
                'risk':0.005,
                'rps':1,
                'base_cost':210,
                'cost':210,
                'unlock_rps':.2,
                'unlocked':false
            },
            'trailer':{
                'label':'Abandoned Trailer',
                'description':'An abandoned trailer in an area heavily neglected by the police',
                'amount':0,
                'risk':0.01,
                'rps':5,
                'base_cost':1000,
                'cost':1000,
                'unlock_rps':1.2,
                'unlocked':false,
            },
            '05_house':{
                'label':'Small House',
                'description':'A small house in a bad neighborhood',
                'amount':0,
                'risk':0.05,
                'rps':25,
                'base_cost':5000,
                'cost':5000,
                'unlock_rps':6,
                'unlocked':false
            },
            '07_warehouse':{
                'label':'Abandoned Warehouse',
                'description':'A large abandoned warehouse with vaulted ceilings',
                'amount':0,
                'rps':100,
                'risk':0.05,
                'base_cost':25000,
                'cost':25000,
                'unlock_rps':50,
                'unlocked':false
            },
            '09_lab':{ 
                'label':'Laboratory',
                'description':'An above ground laboratory outfitted for meth production',
                'amount':0,
                'rps':500,
                'risk':0.1,
                'base_cost':125000,
                'cost':125000,
                'unlock_rps':250,
                'unlocked':false
            },
            '10_under_lab': {
                'label':'Underground Laboratory',
                'description':'An massive hidden laboratory for your discreet cooking needs',
                'amount':0,
                'risk':0.005,
                'rps':2000,
                'base_cost':6250000,
                'cost':6250000,
                'unlock_rps':1000,
                'unlocked':false
            },
            '11_bot': {
                'label':'Meth-o-matic 9000',
                'description':'The latest and greatest in laboratory technology, converted for meth production',
                'amount':0,
                'risk':0.1,
                'rps':13000,
                'base_cost':35000000,
                'cost':35000000,
                'unlock_rps':6500,
                'unlocked':false
            },
            '11_bot_s': {
                'label':'Meth-o-matic 9000S',
                'description':'Just like Meth-o-matic, but features voice activated control',
                'amount':0,
                'risk':0.1,
                'rps':14000,
                'base_cost':40000000,
                'cost':40000000,
                'unlock_rps':8000,
                'unlocked':false
            },
            'under_complex':{
                'label':'Subterranean Complex',
                'description':'A sprawling underground complex the size of a small city',
                'amount':0,
                'risk':0.005,
                'rps':50000,
                'base_cost':505000000,
                'cost':505000000,
                'unlock_rps':25000,
                'unlocked':false
            },
            'country':{
                'label':'Island State',
                'description':'Purchase a small island country, and turn it into a meth-based economic superpower',
                'amount':0,
                'risk':0.00000001,
                'rps':105000,
                'base_cost':2501000000,
                'cost':2501000000,
                'unlock_rps':50000,
                'unlocked':false
            },
            '12_moon_lab': {
                'label':'Moonlab Alpha',
                'description':'A massive moon laboratory for cooking meth far away from the DEA\'s clutches',
                'amount':0,
                'risk':0.00000001,
                'rps':1150000,
                'base_cost':32501000000,
                'cost':32501000000,
                'unlock_rps':150000,
                'unlocked':false
            },
            'station': {
                'label':'Meth Star',
                'description':'That\'s no moon... it\'s a man made super lab! '
                    + ' With tractor beams.',
                'amount':0,
                'risk':0.000000001,
                'rps':11205000,
                'base_cost':1632501000000,
                'cost':1632501000000,
                'unlock_rps':1300000,
                'unlocked':false
            },
            'belt':{
                'label':'Heisenbelt',
                'description':'A series of labs on the outer edges of the solar '
                    + 'system that convert asteroids into pure crystal',
                'amount':0,
                'risk':0.000001,
                'rps':55205000,
                'base_cost':41032501000000,
                'cost':41032501000000,
                'unlock_rps':13000000,
                'unlocked':false
            },
        },


        // DISTRIBUTION
        'sellers':{
            '01_dealer':{
                'label':'Dealer',
                'description':'A common street thug to sell your goods',
                'amount':0,
                'risk':0.03,
                'rps':.2,
                'base_cost':20,
                'cost':20,
                'unlock_rps':0.5,
                'unlocked':true,
            },
            '03_drug_mule':{
                'label':'Drug Mule',
                'description':'Someone to stuff drugs in their rectum and distribute them',
                'amount':0,
                'risk':0.005,
                'rps':1,
                'base_cost':230,
                'cost':230,
                'unlock_rps':.2,
                'unlocked':false
            },
            'drug_van':{
                'label':'Drug Van',
                'description':'A runned-down van that actively seeks out customers',
                'amount':0,
                'risk':0.05,
                'rps':8,
                'base_cost':2300,
                'cost':2300,
                'unlock_rps':1,
                'unlocked':false           
            },
            'cheap_lawyer':{
                'label':'Sleazy Lawyer',
                'description':'Reduces your risk of getting charged by the DEA, also distributes some product on the side',
                'amount':0,
                'risk':-0.05,
                'rps':10,
                'base_cost':5000,
                'cost':5000,
                'unlock_rps':5,
                'unlocked':false
            },
            '04_club':{
                'label':'Night Club',
                'description':'Purchase a run down night club and sell your classy product to the patrons',
                'amount':0,
                'risk':0.05,
                'rps':100,
                'base_cost':25000,
                'cost':25000,
                'unlock_rps':50,
                'unlocked':false
            },
            '05_cartel':{
                'label':'Drug Cartel',
                'description':'Drug cartels can move a lot of product, but their services are not free',
                'amount':0,
                'risk':0.10,
                'rps':400,
                'base_cost':125000,
                'cost':125000,
                'unlock_rps':250,
                'unlocked':false
            },
            '07_dea':{
                'label':'DEA Mole',
                'description':'Hire a DEA informant, which allows for increased and discreet distribution while reducing risk',
                'amount':0,
                'risk':-0.05,
                'rps':1000,
                'base_cost':6250000,
                'cost':6250000,
                'unlock_rps':500,
                'unlocked':false
            },
            '09_diplomat':{ 
                'label':'Foreign Diplomat',
                'description':'Hire a foreign diplomat to partner with the best drug pushers in their respective countries and reduce risk',
                'amount':0,
                'risk':-0.05,
                'rps':5000,
                'base_cost':33000000,
                'cost':33000000,
                'unlock_rps':2500,
                'unlocked':false
            },
            '11_city_police':{
                'label':'City Police Force',
                'description':'Pay off an entire city police force. All of them, even the by-the-book detectives, greatly reducing risk',
                'amount':0,
                'risk':-0.1,
                'rps':10500,
                'base_cost':165000000,
                'cost':165000000,
                'unlock_rps':5000,
                'unlocked':false
            },
             'senator':{
                'label':'Crooked Senator',
                'description':'This crooked member of the senate will provide you with some of the best distribution channels as well as help keep the fed outta your biznaz',
                'amount':0,
                'risk':-0.1,
                'rps':45000,
                'base_cost':801000000,
                'cost':801000000,
                'unlock_rps':20000,
                'unlocked':false
            },       
            'big_cartel':{
                'label':'Rival Cartel',
                'description':'Pay off a rival cartel, greatly increasing the demand for your product',
                'amount':0,
                'risk':0.25,
                'rps':105000,
                'base_cost':3005000000,
                'cost':3005000000,
                'unlock_rps':60000,
                'unlocked':false
            },
            'dictator':{
                'label':'El Presidente',
                'description':'Partner with a dictator of an impoverished country for unchecked meth distribution',
                'amount':0,
                'risk':-0.05,
                'rps':1150000,
                'base_cost':32501000000,
                'cost':32501000000,
                'unlock_rps':160000,
                'unlocked':false
            },
            'space_mules':{
                'label':'Space Mules',
                'description':'Space mules ain\'t your daddy\'s drug mule. '
                    + 'They supply '
                    + 'extra terrestrial beings with a steady stream of your sweet sweet '
                    + 'crystal',
                'amount':0,
                'risk':0.000001,
                'rps':11205000,
                'base_cost':1632501000000,
                'cost':1632501000000,
                'unlock_rps':1300000,
                'unlocked':false
            },
            'shuttle':{
                'label':'Meth Horizon',
                'description':'According to commander Tony Drake, these '
                    + 'high speed shuttles quickly transport product '
                    + 'from the far edges of the solar system',
                'amount':0,
                'risk':0.000001,
                'rps':55205000,
                'base_cost':41032501000000,
                'cost':41032501000000,
                'unlock_rps':13000000,
                'unlocked':false
            },
        },

        // UPGRADES
        'upgrades':{
            // UPG VENTILATION STUFF
            '00_air_fresheners':{
                'label':'Air Fresheners',
                'description':'With the sweet sent of pine in the air, you can cook an extra batch at a time.',
                'action':'make_amount',
                'purchased':false,
                'mod':1,
                'cost':10,
                'prereq':null,
            },
            '01_exhaust_fan':{
                'label':'Exhaust Fan',
                'description':'You can now cook 5 more batches at a time',
                'action':'make_amount',
                'purchased':false,
                'mod':5,
                'cost':100,
                'prereq':'00_air_fresheners',
            },
            '02_goatee':{
                'label':'Goatee',
                'description':'Your mighty goatee intimidates buyers into buying more product; you can now sell an extra batch at a time',
                'action':'sell_amount',
                'purchased':false,
                'mod':1,
                'cost':10,
                'prereq':null,
            },
            '03_hvac':{
                'label':'Industrial HVAC',
                'description':'Keep the fumes out. You can now cook 100 more batches at a time',
                'action':'make_amount',
                'purchased':false,
                'mod':100,
                'cost':11050,
                'prereq':'01_exhaust_fan',
            },
            '04_glasses':{
                'label':'Prescription Glasses',
                'description':'Your nerdy specs make your buyers feel they can trust you more; you can now sell 5 additional batches at a time',
                'action':'sell_amount',
                'purchased':false,
                'mod':5,
                'cost':100,
                'prereq':'02_goatee',
            },
            '07_hat': { 
                'label':'Porkpie Hat',
                'description':'This early 20th century hat keeps the sun out of your eyes, allowing you to make an additional 50 batches at a time',
                'action':'make_amount',
                'purchased':false,
                'mod':50,
                'cost':500,
                'prereq':'04_glasses',
            },
            '08_mariachi_band':{
                'label':'Mariachi Band',
                'description':'An authentic narcocorrido band to sing the tale of you and your meth. Allows you to charge an extra $5 per batch',
                'action':'widget_roi',
                'purchased':false,
                'mod':5,
                'cost':17500,
                'prereq':'07_hat',
            },
            '09_vats':{
                'label':'Brewing Vats',
                'description':'Cook your meth in massive vats like the pros. Allows you to cook an additional 500 batches at a time.',
                'action':'make_amount',
                'purchased':false,
                'mod':500,
                'cost':4507500,
                'prereq':'08_mariachi_band',
            },
            // UPG SELLERS
            '11_dealer_business_cards':{
                'label':'Dealer Business Cards',
                'description':'Improves sale rate of your dealers by .1/s',
                'action':'sellers.01_dealer.rps',
                'purchased':false,
                'mod':.1,
                'cost':75,
                'prereq':'02_goatee',
            },
            '13_spinning_rims':{
                'label':'Spinnin\' Rims',
                'description':'Roll with style! Improves the sale rate of your dealers by .2/s',
                'action':'sellers.01_dealer.rps',
                'purchased':false,
                'mod':.2,
                'cost':250,
                'prereq':'11_dealer_business_cards',
            },
            'dealer_slacks':{
                'label':'Dealer Slacks',
                'description':'Your dealers now wear nice slacks, reducing suspicion by 1%',
                'action':'sellers.01_dealer.risk',
                'purchased':false,
                'mod':-.01,
                'cost':550,
                'prereq':'13_spinning_rims',
            },
            'mules_1': {
                'label':'Stuffed Mules',
                'description':'Your Drug Mules can now sell an additional 2.5 batches at a time',
                'action':'sellers.03_drug_mule.rps',
                'purchased':false,
                'mod':3,
                'cost':1250,
                'prereq':'dealer_slacks',
            },
            'mules_2': {
                'label':'Double Stuffed Mules',
                'description':'Your Drug Mules can now sell an additional 16 batches at a time',
                'action':'sellers.03_drug_mule.rps',
                'purchased':false,
                'mod':16,
                'cost':55000,
                'prereq':'mules_1',
            },
            'dealer_guns': {
                'label':'Dealer Heat',
                'description':'Now your dealers are packin\' heat, allowing them to safely sell another half-batch at a time',
                'action':'sellers.01_dealer.rps',
                'purchased':false,
                'mod':0.5,
                'cost':8000,
                'prereq':'dealer_slacks',
            },
            'van_jingle':{
                'label':'Van Jingle',
                'description':'Your drug vans play a catchy jingle to attract more customers, selling 5 more batches at a time',
                'action':'sellers.drug_van.rps',
                'purchased':false,
                'mod':5,
                'cost':16000,
                'prereq':'dealer_guns',
            },
            'lawyers_sleaze': {
                'label':'Extra Sleaze',
                'description':'Your lawyers are now extra sleazy, and can sell an additional 10 batches at a time',
                'action':'sellers.cheap_lawyer.rps',
                'purchased':false,
                'mod':10,
                'cost':150000,
                'prereq':'van_jingle',
            },
            'lawyers_better':{
                'label':'Better Lawyers',
                'description':'Your sleazy lawyers now reduce risk by an additional 5%',
                'action':'sellers.cheap_lawyer.risk',
                'purchased':false,
                'mod':-0.05,
                'cost':1175000,
                'prereq':'lawyers_sleaze',
            },
            'lawyers_best':{
                'label':'Lawyers 2.0',
                'description':'Your sleazy lawyers now use the Chewbacca Defense. They reduce risk by an additional 5%',
                'action':'sellers.cheap_lawyer.risk',
                'purchased':false,
                'mod':-0.05,
                'cost':11275000,
                'prereq':'lawyers_better',
            },
            'lawyers_super':{
                'label':'Super Lawyers',
                'description':'Your sleazy lawyers now wear a cape. They reduce risk by an additional 5%',
                'action':'sellers.cheap_lawyer.risk',
                'purchased':false,
                'mod':-0.05,
                'cost':210555000,
                'prereq':'lawyers_best',
            },       
            'lawyers_magic':{
                'label':'Immortal Lawyers',
                'description':'Your lawyers are now demigods. They reduce risk by an additional 10%',
                'action':'sellers.cheap_lawyer.risk',
                'purchased':false,
                'mod':-0.10,
                'cost':164200552000,
                'prereq':'lawyers_super',
            },
            'better_diplomats': {
                'label':'Diplomatic Immunity',
                'description':'Your diplomats can now sell an extra 1K batches',
                'action':'sellers.09_diplomat.rps',
                'purchased':false,
                'mod':1000,
                'cost':15005000,
                'prereq':'lawyers_sleaze',
            },
            '21_portable_generator':{
                'label':'Portable Power Generator',
                'description':'Provides extra power to your RVs - adding 0.5 production per second',
                'action':'clickers.03_used_rv.rps',
                'purchased':false,
                'mod':0.5,
                'cost':150,
                'prereq':'01_exhaust_fan',
            },
            'shed_power':{
                'label':'Shed Propane',
                 'description':'Outfit your Storage Sheds with propane and propane accessories. They cook another 0.8 batches at a time',
                'action':'clickers.01_storage_shed.rps',
                'purchased':false,
                'mod':0.8,
                'cost':9500,
                'prereq':'21_portable_generator',
               
            },
            'rv_solar':{
                'label':'RV Solar Panels',
                'description':'Harness the power of the sun! Allows your RV cooks to make an additional 2.5 batches at a time',
                'action':'clickers.03_used_rv.rps',
                'purchased':false,
                'mod':2.5,
                'cost':1250,
                'prereq':'shed_power',
            },
            'camper_lab':{
                'label':'Mobile Lab',
                'description':'Completely outfit your RVs for maximum meth production, netting you 16 extra batches at a time',
                'action':'clickers.03_used_rv.rps',
                'purchased':false,
                'mod':16,
                'cost':55000,
                'prereq':'rv_solar',
            },
            '22_hazmat_suit':{
                'label':'Hazmat Suit',
                'description':'Now you can cook without regard for personal safety! '
                    + 'Make an additional 100 batches at a time',
                'action':'make_amount',
                'purchased':false,
                'mod':100,
                'cost':15000,
                'prereq':'04_glasses',
            },

            '23_personal_enforcer':{
                'label':'Personal Enforcer',
                'description':'Hire a personal enforcer to prevent your shit from getting stolen, you can now sell an extra 100 batches at a time',
                'action':'sell_amount',
                'purchased':false,
                'mod':100,
                'cost':15000,
                'prereq':'22_hazmat_suit',
            },
            // UPG BURNERS 
            '31_electric_hotplate':{
                'label':'Electric Hotplate',
                'description':'Used for cooking',
                'action':null,
                'purchased':true,
                'mod':0,
                'cost':25,
                'prereq':null,
            },
            '32_gas_stove':{
                'label':'Gas Stove',
                'description':'Improves meth purity by 0.5 IPU',
                'cost':120,
                'action':'widget_roi',
                'mod':0.5,
                'purchased':false,
                'prereq':null,
            },
            '33_steel_burner':{
                'label':'Steel Burners',
                'description':'Improves meth purity by another 0.5 IPU',
                'cost':240,
                'action':'widget_roi',
                'mod':0.5,
                'purchased':false,
                'prereq':'32_gas_stove',
            },
            '34_titanium_burner':{
                'label':'Titanium Burners',
                'description':'Spaceship-grade burners improve meth purity by 1 IPU',
                'cost':3550,
                'action':'widget_roi',
                'mod':1,
                'purchased':false,
                'prereq':'33_steel_burner',
            },
            '35_platinum_burner':{
                'label':'Platinum Burners',
                'description':'Industrial grade platinum burners improve meth purity by 3 IPUs',
                'cost':23550,
                'action':'widget_roi',
                'mod':3,
                'purchased':false,
                'prereq':'34_titanium_burner',
            },
           
            // UPG COOKWARE
            '41_cheap_cookware':{
                'label':'Cheap Cookware',
                'description':'Used to cook stuff',
                'cost':20,
                'action':null,
                'mod':0,
                'purchased':true,
                'prereq':null,
            },
            '42_steel_cookware':{
                'label':'Stainless Steel Cookware',
                'description':'Improves meth purity by 0.5 IPU',
                'cost':120,
                'action':'widget_roi',
                'mod':0.5,
                'purchased':false,
                'prereq':null,
            },
            '43_glass_flasks':{
                'label':'Glass Flasks',
                'description':'Further improves meth purity by another 0.5 IPU',
                'cost':240,
                'action':'widget_roi',
                'mod':0.5,
                'purchased':false,
                'prereq':'42_steel_cookware',
            },
            '46_hard_glass_boilers':{
                'label':'Hardened Glass Boilers',
                'description':'Further improves meth purity by 1 IPU',
                'cost':1500,
                'action':'widget_roi',
                'mod':1,
                'purchased':false,
                'prereq':'43_glass_flasks',
            },
            
            '47_carbon_filters':{
                'label':'Carbon Filtration',
                'description':'Filters out the extra deadly components, adding 3 IPUs',
                'cost':92500,
                'action':'widget_roi',
                'mod':3,
                'purchased':false,
                'prereq':'46_hard_glass_boilers',
            },
            '49_diamond_flasks':{
                'label':'Diamond Flasks',
                'description':'Further improves purity by 5 IPUs',
                'cost':252500,
                'action':'widget_roi',
                'mod':5,
                'purchased':false,
                'prereq':'46_hard_glass_boilers',
            },
            '50_platinum_boilers':{
                'label':'Platinum Boilers',
                'description':'Improves purity by 10 IPUs!',
                'cost':2155000,
                'action':'widget_roi',
                'mod':10,
                'purchased':false,
                'prereq':'49_diamond_flasks',
            },
            '53_space_hazmat':{
                'label':'Space Hazmat Suit',
                'description':'Now you can cook in space! Cook an additional 1000 batches at a time',
                'cost':121550000,
                'action':'make_amount',
                'mod':1000,
                'purchased':false,
                'prereq':'50_platinum_boilers',
            },
            'personal_snipers':{
                'label':'SWAT Snipers',
                'description':'Your team of highly trained snipers protects you during high-value transactions. Safely sell an additional 1000 batches at a time',
                'cost':321500000,
                'action':'sell_amount',
                'mod':1000,
                'purchased':false,
                'prereq':'50_platinum_boilers',
            },
            'chem_degree':{
                'label':'Chemistry Doctorate',
                'description':'By ordering this online degree, your increased '
                    + 'confidence allows you to make another 50% of production batches at a time',
                'cost':4500750000,
                'action':'make_rps_multiplier',
                'mod':0.5,
                'purchased':false,
                'prereq':'53_space_hazmat',
            },
            'mech_suit':{
                'label':'Mech Suit',
                'description':'Your mech suit keeps you safe while making deals. '
                    + 'Sell an additional 50% of sales batches at a time',
                'cost':5100500000,
                'action':'sell_rps_multiplier',
                'mod':0.5,
                'purchased':false,
                'prereq':'personal_snipers',
            },
            'slap_chop':{
                'label':'Slap Chop (TM)',
                'description':'You\'re gonna love my meth. With this precision '
                    + 'cutting device, you can now make an addition 50% of production '
                    + 'at a time',
                'cost':18100500000,
                'action':'make_rps_multiplier',
                'mod':0.5,
                'purchased':false,
                'prereq':'chem_degree',
            },
             'fearless':{
                'label':'Fearless',
                'description':'After facing death so many times, '
                    +'you no longer have a sense of self preservation. '
                    +'Sell another 50% of sales at a time',
                'cost':20100500000,
                'action':'sell_rps_multiplier',
                'mod':0.5,
                'purchased':false,
                'prereq':'mech_suit',
            },
            'better_genetics':{
                'label':'Pinky Genetics',
                'description':'Hire every scientist on the planet to enhance your '
                    + 'finger dexterity. Manually cook an additional 100% of production at a time',
                'cost':3518100500000,
                'action':'make_rps_multiplier',
                'mod':1,
                'purchased':false,
                'prereq':'slap_chop',
            }, 
            'crack_bite':{
                'label':'Methbie',
                'description':'After being bitten by a radioactive crack head, '
                    + 'you\'ve gained super strength. Manually sell '
                    + 'an additional 100% of sales at a time',
                'cost':3720100500000,
                'action':'sell_rps_multiplier',
                'mod':1,
                'purchased':false,
                'prereq':'fearless',
            },
            'ancient_methology': { 
                'label':'Ancient Methology',
                'description':'Send your best scientists to remote parts of the world looking for '
                    + 'lost secrets of meth production, increase purity by 10 IPUs',
                'cost':820000000,
                'action':'widget_roi',
                'mod':10,
                'purchased':false,
                'prereq':'50_platinum_boilers',           
            },
            'methylamine_secret': { 
                'label':'Methylamine X',
                'description':'By unlocking this experimental methylamine-based compound you increase purity by 10 IPUs',
                'cost':126321500000,
                'action':'widget_roi',
                'mod':10,
                'purchased':false,
                'prereq':'ancient_methology',           
            },
            'alien_meth':{
                'label':'Meth of the Third Kind',
                'description':'Exta terrestrial meth purification processes '
                    + 'have been discovered on Mars. Increases purity by another 12 IPUs',
                'cost':2100320555000,
                'action':'widget_roi',
                'mod':12,
                'purchased':false,
                'prereq':'methylamine_secret',           
            },
            'donator_thanks':{
                'label':'Thank You',
                'description':'Thanks for donating, your meth is now worth $50 more per batch',
                'cost':321500000,
                'action':'widget_roi',
                'mod':50,
                'purchased':false,
                'prereq':'hidden',
            },
         },

        // ACHIEVEMENTS
        'achievements': { 
            'hand_made_widgets_1': { 
                'label':'This is kinda fun...',
                'description':'You\'ve hand-cooked your first batch of meth',
                'property':'stats.hand_made_widgets',
                'required':1,
                'unlocked':false,
                'value':1,
                'group':10,
                'min_time':1,
            },
            'hand_made_widgets_2': { 
                'label':'I see how this works',
                'description':'You\'ve hand-cooked 100 batches of meth',
                'property':'stats.hand_made_widgets',
                'required':100,
                'unlocked':false,
                'value':2,
                'group':11,
                'min_time':1,
            },
            'hand_made_widgets_3': { 
                'label':'Click apprentice',
                'description':'You\'ve hand-cooked 1,000 batches of meth',
                'property':'stats.hand_made_widgets',
                'required':1000,
                'unlocked':false,
                'value':3,
                'group':12,
                'min_time':1,
            },
            'hand_made_widgets_4':{ 
                'label':'Click magician',
                'description':'You\'ve hand-cooked 100,000 batches of meth',
                'property':'stats.hand_made_widgets',
                'required':100000,
                'unlocked':false,
                'value':4,
                'group':13,
                'min_time':1,
            },      
            'hand_made_widgets_5':{ 
                'label':'Clickity-splickity',
                'description':'You\'ve hand-cooked 1,000,000 batches of meth',
                'property':'stats.hand_made_widgets',
                'required':1000000,
                'unlocked':false,
                'value':5,
                'group':14,
                'min_time':1,
            },      
            'hand_made_widgets_6':{ 
                'label':'I AM THE ONE WHO CLICKS',
                'description':'YOU are to be feared. You\'ve hand-cooked 100,000,000 batches of meth!',
                'property':'stats.hand_made_widgets',
                'required':100000000,
                'unlocked':false,
                'value':6,
                'group':15,
                'min_time':1,
            },
            'total_cash_1': {
                'label':'In the meth business',
                'description':'You\'ve earned your first $1,000',
                'property':'stats.total_cash',
                'required':1000,
                'unlocked':false,
                'value':1,
                'group':20,
                'min_time':1,           
            },
            'total_cash_2': {
                'label':'In the money business',
                'description':'You\'ve earned your first $1,000,000',
                'property':'stats.total_cash',
                'required':1000000,
                'unlocked':false,
                'value':2,
                'group':21,
                'min_time':1,           
            },
            'total_cash_3': {
                'label':'Billion with a B',
                'description':'You\'ve earned your first $1,000,000,000',
                'property':'stats.total_cash',
                'required':1000000000,
                'unlocked':false,
                'value':3,
                'group':22,
                'min_time':1,           
            },
            'total_cash_4': {
                'label':'In the cartel business',
                'description':'You\'ve earned your first $1 trillion',
                'property':'stats.total_cash',
                'required':1000000000000,
                'unlocked':false,
                'value':4,
                'group':23,
                'min_time':1,           
            },
            'total_cash_5': {
                'label':'In the empire business',
                'description':'You\'ve earned $1 quadrillion dollars!',
                'property':'stats.total_cash',
                'required':1000000000000000,
                'unlocked':false,
                'value':5,
                'group':24,
                'min_time':1,           
            },
            // Randoms (group 200+)
            'under_complex_1': {
                'label':'Cookin\' with C.H.U.D.',
                'description':'You\'ve built a Subterranean Complex',
                'property':'clickers.under_complex.amount',
                'required':1,
                'unlocked':false,
                'value':1,
                'group':200,
                'min_time':1,           
            },
            'city_police_1': {
                'label':'I am the law!',
                'description':'An entire City Police Force is on your payroll',
                'property':'sellers.11_city_police.amount',
                'required':1,
                'unlocked':false,
                'value':1,
                'group':210,
                'min_time':1,           
            },
            'lab_1': { 
                'label':'Science, bitch!',
                'description':'You\'ve acquired a laboratory',
                'property':'clickers.09_lab.amount',
                'required':1,
                'unlocked':false,
                'value':1,
                'group':220,
                'min_time':1,           
            },
            'moon_lab_1':{
                'label':'One small step for meth kind',
                'description':'You\'ve built a Moon Lab',
                'property':'clickers.12_moon_lab.amount',
                'required':1,
                'unlocked':false,
                'hidden':false,
                'value':1,
                'group':227,
                'min_time':1,           
            },
            'station_1':{
                'label':'The meth is strong with you',
                'description':'You\'ve built a Meth Star',
                'property':'clickers.station.amount',
                'required':1,
                'unlocked':false,
                'hidden':false,
                'value':1,
                'group':227,
                'min_time':1,           
            },
            'dea_1':{
                'label':'On the inside',
                'description':'A DEA Mole is now in your pocket',
                'property':'sellers.07_dea.amount',
                'required':1,
                'unlocked':false,
                'hidden':false,
                'value':1,
                'group':227,
                'min_time':1,           
            },
            'cheated_cash_1':{
                'label':'Counterfeiter',
                'description':'You\'ve hacked in some cash',
                'property':'stats.cheated_cash',
                'required':1,
                'unlocked':false,
                'hidden':true,
                'value':1,
                'group':230,
                'min_time':1,           
            },
            'cheated_meth_1':{
                'label':'Meth from nowhere',
                'description':'You\'ve hacked in some batches-o-meth',
                'property':'stats.cheated_widgets',
                'required':1,
                'unlocked':false,
                'hidden':true,
                'value':1,
                'group':240,
                'min_time':1,           
            },
            'banana_stand': {
                'label':'Frozen Bananas',
                'description':'There\'s always money in the banana stand',
                'property':'banks.storage_1m.purchased',
                'required':true,
                'unlocked':false,
                'hidden':false,
                'value':1,
                'group':250,
                'min_time':1,           
            }, 
        },

        // EVENTS
        'events': { 
            'cash_found_small':{
                'chance':0.04,
                'action':'event_found_cash(60)',
                'min_d_level':0,
                'max_d_level':2,
            },
            'cash_found_med': {
                'chance':0.005,
                'action':'event_found_cash(240)',
                'min_d_level':0,
                'max_d_level':1,
            },
            'cash_found_large': {
                'chance':0.001,
                'action':'event_found_cash(640)',
                'min_d_level':0,
                'max_d_level':0,
            },
            'meth_found_small':{
                'chance':0.04,
                'action':'event_found_meth(120)',
                'min_d_level':0,
                'max_d_level':1,
            },
            'building_seized':{
                'chance':0.2,
                'action':'event_dea_seize_building()',
                'min_d_level':0,
                'max_d_level':2,
            },
            'cash_lost': { 
                'chance':0.007,
                'action':'event_lose_cash(60)',
                'min_d_level':0,
                'max_d_level':2,
            },
            'rival_cash_lost': { 
                'chance':0.005,
                'action':'event_rival_lose_cash(205)',
                'min_d_level':0,
                'max_d_level':2,
            },
            'pay_bribe':{
                'chance':0.01,
                'action':'event_pay_bribe(125)',
                'min_d_level':0,
                'max_d_level':3,
            },
            'lose_meth':{
                'chance':0.005,
                'action':'event_lose_meth(125)',
                'min_d_level':0,
                'max_d_level':3,
            },
            // DIFFICULTY 0 EVENTS (Easy)
            
            // DIFFICULTY 1 EVENTS (Medium)

            // DIFFICULTY 2 EVENTS (Hard)
            
        },
        // STATISTICS
        'stats': {
            'seller_rps':0,
            'clicker_rps':0,
            'cheated_widgets':0,
            'cheated_cash':0,
            'hand_made_widgets':0,
            'made_widgets':0,
            'sold_widgets':0,
            'hand_sold_widgets':0,
            'bought_upgrades':0,
            'total_cash':0,
            'start_time':(new Date).getTime(),
        },
    };


    // sec_tick() - Runs every 1000ms 
    this.sec_tick = function() {
        fix_saved();
        fix_stats();
        fix_safe_cash(); 
        check_achievements();
    }

    // tick() - Runs every tick_ms (default 100ms)
    this.tick = function() { 
        
        var this_tick = (new Date).getTime();
        var this_sub = 1000 / tick_ms;
        var ticks = Math.round((this_tick - last_tick) / tick_ms);
        if(ticks > 360000) { 
            ticks = 360000;
        }
        last_tick = this_tick;

        var make_amount = 0;
        for(var k in pd.clickers) {
            var cl = pd.clickers[k]; 
            make_amount += cl.amount * cl.rps;
        }
        pd.stats.clicker_rps = make_amount;
        make_amount = make_amount / this_sub;
        do_make(make_amount * ticks);
       
        var sell_amount = 0;
        for(var k in pd.sellers) { 
            var sl = pd.sellers[k];
            sell_amount += sl.amount * sl.rps;
        }
        pd.stats.seller_rps = sell_amount;
        sell_amount = sell_amount / this_sub;

        do_sell(sell_amount * ticks);

        fix_display();
    }

    // Version check
    this.check_version = function() { 
        $.get('/version.json',
            function(data) { 
                if(data.data.version) {
                    if(data.data.version != pd.version) { 
                        $('#updated').show(500);
                    }
                }
            }
            
        ,"json");
    }

    // Calculate and return the player's risk level
    function get_risk() { 
        var rsk = 0;
        for(var k in pd.clickers) { 
            if(pd.clickers[k].risk) { 
                rsk += pd.clickers[k].risk * pd.clickers[k].amount;
            }
        }
        for(var k in pd.sellers) { 
            if(pd.sellers[k].risk) { 
                rsk += pd.sellers[k].risk * pd.sellers[k].amount;
            }
        }
        return rsk;
    }


    this.get_click_sell_amount = function() { 
        return pd.sell_amount + (pd.stats.seller_rps * pd.sell_rps_multiplier);
    }

    this.get_click_make_amount = function() { 
        return pd.make_amount + (pd.stats.clicker_rps * pd.make_rps_multiplier);
    }

    this.get_widget_roi = function() {
        return pd.widget_roi;
    }

    this.get_title = function() { 
        return pd.title;
    }

    function get_item_cost(scl) { 
        var cst = ((scl.amount + 1) * scl.base_cost) * (scl.amount + 1);
        // Double costs if > 10 are owned
        if((scl.amount + 1) > 10) { 
            cst *= 2;
        }
        return cst;
    }

    function get_item_last_cost(scl) { 
        var cst = ((scl.amount) * scl.base_cost) * (scl.amount);
        // Double costs if > 10 are owned
        if(scl.amount > 10) { 
            cst *= 2;
        }
        return cst;
    }

    function get_item_sell_value(scl) {
        return get_item_last_cost(scl) * (pd.sell_return * pd.economy_roi);
    }
    
    function get_safe_cash() { 
        return pd.cash.safe;
    }

    function get_unsafe_cash() { 
        var unsafe = pd.cash.amount - pd.cash.safe;
        if(unsafe < 0) { unsafe = 0; }
        return unsafe;
    }

    function new_save_to_pd() {

    }
    function new_pd_to_save() {

    }

    function update_save_from_pd() { 
        var sv = {
            'cash':Math.round(pd.cash.amount),
            'cash_safe':Math.round(pd.cash.safe),
            'widgets':Math.round(pd.widgets.amount),
            'clickers':{},
            'sellers':{},
            'upgrades':{},
            'banks':[],
            'stats':pd.stats,
            'version':pd.version,
        };
        // Banks
        for(var k in pd.banks) { 
            if(pd.banks[k].purchased) {
                sv.banks.push(k);
            }
        }
        // Clickers 
        for(var k in pd.clickers) { 
            sv.clickers[k] = {
                'amount':pd.clickers[k].amount,
                'unlocked':pd.clickers[k].unlocked,
            };
        }
        // Sellers
        for(var k in pd.sellers) { 
            sv.sellers[k] = {
                'amount':pd.sellers[k].amount,
                'unlocked':pd.sellers[k].unlocked,
            };
        }
        // Upgrades 
        for(var k in pd.upgrades) { 
            sv.upgrades[k] = {
                'purchased':pd.upgrades[k].purchased,
            };
        }
        localStorage.sv = JSON.stringify(sv);

        // Achievements
        var ac = [];
        for(var k in pd.achievements) { 
            if(pd.achievements[k].unlocked) { 
                ac.push(k);
            }
        }
        localStorage.ac = JSON.stringify(ac);
        
    }

    function update_pd_from_save() { 
        if(localStorage.sv) { 
            var sv = $.parseJSON(localStorage.sv);
            pd.cash.amount = sv.cash;
            if(sv.cash.safe) { pd.cash.safe = sv.cash.safe; }
            pd.widgets.amount = sv.widgets;
            $.extend(pd.stats, sv.stats);
            // Banks
            if(sv.banks) {
                for(var i=0; i<sv.banks.length; i++) { 
                    if(pd.banks[sv.banks[i]]) {
                        apply_bank(sv.banks[i]);
                    }
                }
            }
            // Clickers
            for(var k in sv.clickers) { 
                if(pd.clickers[k]) {
                    pd.clickers[k].amount = sv.clickers[k].amount;
                    pd.clickers[k].unlocked = sv.clickers[k].unlocked;
                }
            }
            // Sellers
            for(var k in sv.sellers) { 
                if(pd.sellers[k]) { 
                    pd.sellers[k].amount = sv.sellers[k].amount;
                    pd.sellers[k].unlocked = sv.sellers[k].unlocked;
                }
            }
            // Upgrades
            for(var k in sv.upgrades) { 
                if(pd.upgrades[k]) { 
                    if(sv.upgrades[k].purchased) { 
                        apply_upgrade(k);
                    }
                }
            }
        } 
        // Achievements
        if(localStorage.ac) { 
            var ac = $.parseJSON(localStorage.ac);
            for(var i=0; i<ac.length; i++) {
                if(pd.achievements[ac[i]]) { 
                    pd.achievements[ac[i]].unlocked = true;
                }
            }
        }
    }

    /****************************************************************************** 
     * ACTIONS
     */

    // Expose "add_cash" for cheaters
    this.add_cash = function(n) { 
        pd.cash.amount += n;
        pd.stats.cheated_cash += n;
    }

    // Expose "add_widgets" for cheaters
    this.add_widgets = function(n) { 
        pd.widgets.amount += n;
        pd.stats.cheated_widgets += n;
    }
    

    this.do_save = function() {
        update_save_from_pd();
        last_save = (new Date).getTime();
        if(has_gaq) { 
            _gaq.push(['_trackPageview','/game_save']);
        }
    }

    this.do_load = function() { 
        if(localStorage.sv) { 
            update_pd_from_save();
            message('Game loaded!');
            if(has_gaq) { 
                _gaq.push(['_trackPageview','/game_load']);
            }
        }
    }

    this.do_import = function() { 
        var imptxt = window.prompt("Data to import","");
        if(imptxt == 'THANK YOU!') {
            good_message('You have unlocked the "Thank You" hidden upgrade'); 
            apply_upgrade('donator_thanks');
        }

    }

    this.do_reset = function() { 
        localStorage.clear();
        message('Game reset');
        location.reload();
        if(has_gaq) { 
            _gaq.push(['_trackPageview','/game_reset']);
        }
    }

    this.do_reset_confirm = function() { 
        var ok = confirm('Are you sure? You\'ll lose everything.');
        if(ok) { 
            this.do_reset();
        }
    }


    function do_make(n) {
        pd.widgets.amount += n;   
        pd.stats.made_widgets += n; 
        return true;
    }

    this.do_make_click = function() { 
        var nw = (new Date).getTime();
        if((nw - last_click) < 70) { 
            return false;
        }
        last_click = nw;
        var amt = this.get_click_make_amount();
        if(do_make(amt)) { 
            //message('You made '+pretty_int(pd.make_amount)+' '+pd.widgets.label);
            pd.stats.hand_made_widgets += amt;
            fix_make_sell();
        }
    }

    function do_sell(n) { 
        if(n > pd.widgets.amount) {
            n += (pd.widgets.amount - n);
            if(n < 1) { 
                return false;
            } 
        }
        pd.stats.sold_widgets += n;
        pd.widgets.amount -= n;
        pd.cash.amount += (n * pd.widget_roi);
        pd.stats.total_cash += (n * pd.widget_roi);
        return n;
    }

    this.do_sell_click = function() {
        var nw = (new Date).getTime();
        if((nw - last_click) < 70) {
            return false;
        } 
        last_click = nw;
        var sale = do_sell(this.get_click_sell_amount());
        if(sale) { 
            //message('You sold '+pretty_int(sale)+' '+pd.widgets.label);
            pd.stats.hand_sold_widgets += sale;
            fix_make_sell();
            return sale;
        }
        return 0;
    }

    function get_widget_quality() { 
        var keys = Object.keys(pd.widgets.qualities).sort(function(a,b){return a-b});
        for(var i=0; i<keys.length; i++) { 
            var idx = keys[i];
            if(pd.widget_roi > idx) { 
                continue;
            }
            return pd.widgets.qualities[idx];
        }
        return 'NA';
    }


    /****************************************************************************** 
     * BUY/SELL STUFF
     */

    this.buy_bank = function(key) {
        var bn = pd.banks[key];
        if(!bn) { 
            return error('Invalid bank key');
        }
        if(pd.cash.amount < bn.cost) {
            return false;
        }
        pd.cash.amount -= bn.cost;
        apply_bank(key);
        if(has_gaq) {
            _gaq.push(['_trackPageview','/game_buy_bank']);
        }
        return true;
    }

    function apply_bank(key) { 
        var bn = pd.banks[key];
        if(!bn) { return false; }
        if(bn.purchased) { return false; }
        pd.cash.safe += bn.cash_protect;
        pd.cash.safe_rps += bn.cash_protect_rps;
        bn.purchased = true;
        return true
    }

    this.buy_clicker = function(key) { 
        var cl = pd.clickers[key];
        if(pd.cash.amount < cl.cost) { 
            return false;
        }
        pd.cash.amount -= cl.cost;
        cl.amount += 1;
        message('You have purchased a '+cl.label);
        fix_clickers();
        if(has_gaq) { 
            _gaq.push(['_trackPageview','/game_buy_clicker']);
        }
        return true;
    }

    this.sell_clicker = function(key) { 
        var cl = pd.clickers[key];
        if(cl.amount < 1) { 
            return false;
        }
        var sell_val = get_item_sell_value(cl);
        pd.cash.amount += sell_val;
        message('You sold a '+cl.label+' for $'+pretty_int(sell_val));
        cl.amount -= 1;
        return true;
    }

    this.buy_seller = function(key) { 
        var sl = pd.sellers[key];
        if(pd.cash.amount < sl.cost) { 
            //console.log('SL Cost: '+sl.cost+' CASH: '+pd.cash.amount);
            return false;
        }
        pd.cash.amount -= sl.cost;
        sl.amount += 1;
        message('You have purchased a '+sl.label);
        fix_sellers();
        if(has_gaq) { 
            _gaq.push(['_trackPageview','/game_buy_seller']);
        }
        return true;
    }

    this.sell_seller = function(key) { 
        var sl = pd.sellers[key];
        if(sl.amount < 1) { 
            return false;
        }
        var sell_val = get_item_sell_value(sl);
        pd.cash.amount += sell_val;
        message('You sold a '+sl.label+' for $'+pretty_int(sell_val));
        sl.amount -= 1;
        return true;
    }

    this.buy_upgrade = function(key) { 
        var upg = pd.upgrades[key];
        if(pd.cash.amount < upg.cost) { 
            return false;
        }
        var unl = apply_upgrade(key);
        if(!unl) { 
            return false;
        }
        pd.cash.amount -= upg.cost;
        message('You have unlocked '+upg.label);
        if(has_gaq) { 
            _gaq.push(['_trackPageview','/game_buy_upgrade']);
        }
        fix_upgrades();
    }

    function apply_upgrade(key) { 
        var upg = pd.upgrades[key];
        if(!upg) { 
            return false; 
        }
        if(upg.purchased) { 
            return false;
        }
        upg.purchased = true;
        var act_parts = upg.action.split('.');
        if(act_parts.length == 1) { 
            pd[act_parts[0]] += upg.mod;
        } else if(act_parts.length == 2) {
            pd[act_parts[0]][act_parts[1]] += upg.mod;
        } else if(act_parts.length == 3) { 
            pd[act_parts[0]][act_parts[1]][act_parts[2]] += upg.mod;
        }

        return true;
    }

    function unlock_achievement(key) { 
        var ac = pd.achievements[key];
        if(!ac) { 
            return false;
        }
        if(ac.unlocked) { 
            return false; 
        }
        ac.unlocked = true;
        good_message('You have earned a new achievement: <em>'+ac.label+'</em>');
        return true;
    }

    /****************************************************************************** 
     * FIX DISPLAY 
     */

    function fix_display() { 
        fix_unlocks();
        fix_clickers();
        fix_sellers();
        fix_upgrades();
        fix_make_sell();
        fix_title();
        fix_risk();
        fix_achievements();
        fix_banks(); 
    }

    function fix_achievements() {
        var ac_unl = 0;
        var ac_tot = 0; 
        for(var k in pd.achievements) { 
            var ac = pd.achievements[k];
            var el = $('#'+k);
            var el_lbl = $('#'+k+'_lbl');
            if((ac.hidden)&&(!ac.unlocked)) {
                el.addClass('hidden'); 
                continue;
            }
            ac_tot += 1;
            if(ac.unlocked) { 
                ac_unl += 1;
                el.removeClass('hidden');
                el.removeClass('semi_trans');
                el_lbl.addClass('purchased');
            } else { 
                el.addClass('locked');
                el.addClass('semi_trans');
            }
        }

        $('#achievements_unlocked').html(pretty_int(ac_unl));
        $('#achievements_total').html(pretty_int(ac_tot));
    }

    function fix_banks() {
        var bn_unl = 0;
        var bn_tot = 0;

        for(var k in pd.banks) {
            bn_tot += 1; 
            var bn = pd.banks[k];
            var el = $('#'+k);
            var el_btn = $('#'+k+'_btn');
            var el_lbl = $('#'+k+'_lbl');
            var el_cst = $('#'+k+'_cst');
            el_cst.html('$'+pretty_int(bn.cost));

            // Already purchased
            if(bn.purchased) {
                bn_unl += 1;
                el_lbl.addClass('purchased');
                el.removeClass('hidden');
                el_btn.addClass('hidden');
                continue;
            }

            // Prerequisite purchased
            if((bn.prereq)&&(!pd.banks[bn.prereq].purchased)) { 
                el.addClass('hidden');
                continue;
            }
 
            if(pd.cash.amount < bn.cost) { 
                el_btn.attr('disabled',true);
            } else { 
                el_btn.attr('disabled',false);
            }
            el.removeClass('hidden');
        }
        $('#banks_total').html(pretty_int(bn_tot));
        $('#banks_unlocked').html(pretty_int(bn_unl));
    }

    function fix_risk() { 
        pd.risk_amount = get_risk();
        $('#risk_amount').html(pretty_int(pd.risk_amount * 100)); 
        var el_lvl = $('#risk_level');
        for(var i=0; i<pd.risk_levels.length; i++) {
            el_lvl.html(pd.risk_levels[i].label);
            if(pd.risk_amount < pd.risk_levels[i].level) {
                break;
            }
        }
    }

    function fix_saved() { 
        var s_ago = Math.round(((new Date).getTime() - last_save) / 1000);
        $('#last_saved').html('Game saved '+s_ago+' seconds ago');
    }

    function fix_title() { 
        document.title = '$'+pretty_int(pd.cash.amount)+' | '+pd.title;
    }

    function fix_make_sell() { 
        $('#sell_btn').html(pd.cash.action_label);
        $('#sell_lbl').html(pd.cash.label);
        $('#sell_amt').html(pretty_int(pd.cash.amount));
        $('#sell_roi').html(pretty_int(pd.widget_roi));
        $('#safe_cash').html(pretty_int(get_safe_cash()));
        var sell_rate = pd.stats.seller_rps;
        if((pd.stats.seller_rps > pd.stats.clicker_rps)&&(pd.widgets.amount < pd.stats.seller_rps)) { 
            sell_rate = pd.stats.clicker_rps;
        }
        $('#seller_rps').html(pretty_int(sell_rate * pd.widget_roi));
        $('#make_btn').html(pd.widgets.action_label);
        $('#make_lbl').html(pd.widgets.label);
        $('#make_amt').html(pretty_int(pd.widgets.amount));
        $('#make_qlt').html(get_widget_quality());
        $('#clicker_rps').html(pretty_int(pd.stats.clicker_rps-pd.stats.seller_rps));
        $('#clicker_rps_g').html(pretty_int(pd.stats.clicker_rps));
    }

    function fix_clickers() { 
        var hd_unl = $('#clickers_unlocked');
        var hd_tot = $('#clickers_total');
        var cl_tot = 0;
        var cl_unl = 0;
        for(var k in pd.clickers) { 
            cl_tot += 1;
            var el = $('#'+k);
            var el_btn = $('#'+k+'_btn');
            var el_sell_btn = $('#'+k+'_sell_btn');
            var el_amt = $('#'+k+'_amt');
            var el_cst = $('#'+k+'_cst');
            var el_rps = $('#'+k+'_rps');
            var el_rsk = $('#'+k+'_rsk');

            var cl = pd.clickers[k];
            if(cl.amount > 0) { 
                el_sell_btn.attr('disabled', false);
            } else { 
                el_sell_btn.attr('disabled', true);
            }
            
            cl.cost = get_item_cost(cl); 
            
            if(cl.cost > pd.cash.amount) { 
                el_btn.attr('disabled', true);
            } else { 
                el_btn.attr('disabled', false);
            }
            if(!cl.unlocked) { 
                el.addClass('hidden');
            } else { 
                cl_unl += 1;
                el.removeClass('hidden');
            }
            el_cst.html(pretty_int(cl.cost));
            el_amt.html(pretty_int(cl.amount));
            el_rps.html(pretty_int(cl.rps));
            el_rsk.html(pretty_int(cl.risk * 100));
        }
        hd_unl.html(pretty_int(cl_unl));
        hd_tot.html(pretty_int(cl_tot));
    }

    function fix_sellers() { 
        var hd_unl = $('#sellers_unlocked');
        var hd_tot = $('#sellers_total');
        var sl_tot = 0;
        var sl_unl = 0;
        for(var k in pd.sellers) { 
            sl_tot += 1;
            var el = $('#'+k);
            var el_btn = $('#'+k+'_btn');
            var el_sell_btn = $('#'+k+'_sell_btn');
            var el_amt = $('#'+k+'_amt');
            var el_cst = $('#'+k+'_cst');
            var el_rps = $('#'+k+'_rps');
            var el_rsk = $('#'+k+'_rsk');

            var sl = pd.sellers[k];

            if(sl.amount < 1) { 
                el_sell_btn.attr('disabled', true);
            } else { 
                el_sell_btn.attr('disabled', false);
            }

            sl.cost = get_item_cost(sl);

            if(sl.cost > pd.cash.amount) {
                el_btn.attr('disabled', true); 
            } else { 
                el_btn.attr('disabled', false);
            }
            if(!sl.unlocked) { 
                el.addClass('hidden');
            } else { 
                el.removeClass('hidden');
                sl_unl += 1;
            }
            el_cst.html(pretty_int(sl.cost));
            el_amt.html(pretty_int(sl.amount));
            el_rps.html(pretty_int(sl.rps));
            el_rsk.html(pretty_int(sl.risk * 100));
        }
        hd_unl.html(pretty_int(sl_unl));
        hd_tot.html(pretty_int(sl_tot));
    }

    function fix_unlocks() { 
        for(var k in pd.clickers) { 
            var cl = pd.clickers[k];
            if(cl.unlock_rps <= pd.stats.seller_rps) { 
                cl.unlocked = true;
            }
        }
        for(var k in pd.sellers) { 
            var sl = pd.sellers[k];
            if(sl.unlock_rps <= pd.stats.seller_rps) {
                sl.unlocked = true;        
            }
        }
    }

    function fix_upgrades() {
        var up_tot = 0;
        var up_unl = 0; 
        for(var k in pd.upgrades) {
            var el = $('#'+k); 
            var el_btn = $('#'+k+'_btn');
            var el_cst = $('#'+k+'_cst');
            var upg = pd.upgrades[k];

            if((upg.prereq)) { 
                var req = pd.upgrades[upg.prereq];
                if((req)&&(!req.purchased)) {
                    up_tot += 1;
                    el.addClass('hidden');
                    continue;
                } 
            } 

            if((upg.prereq == 'hidden')&&(!upg.purchased)) { 
                el.addClass('hidden');
                continue;
            } else { 
                up_tot += 1;  
            }  
            
            if(upg.purchased) { 
                el_btn.addClass('hidden');
                $('#'+k+'_lbl').addClass('purchased');
                el_cst.html('&#10004;');
                up_unl += 1;
            } else { 
                el_cst.html('$'+pretty_int(upg.cost));
            }
            if(pd.cash.amount < upg.cost) { 
                el_btn.attr('disabled', true);
            } else { 
                el_btn.attr('disabled', false);
            }
            el.removeClass('hidden');
        }
        $('#upgrades_unlocked').html(pretty_int(up_unl));
        $('#upgrades_total').html(pretty_int(up_tot));
    }

    function fix_safe_cash() {
        pd.cash.safe += pd.cash.safe_rps;
    }

    function fix_stats() {
        var sec_played = Math.round(((new Date).getTime() - pd.stats.start_time) / 1000);
        pd.stats.bought_upgrades = 0;
        for(var k in pd.upgrades) { 
            if(pd.upgrades[k].purchased) { 
                pd.stats.bought_upgrades += 1;
            }
        }
        $('#hand_made_widgets').html(pretty_int(pd.stats.hand_made_widgets));
        $('#made_widgets').html(pretty_int(pd.stats.made_widgets));
        $('#sold_widgets').html(pretty_int(pd.stats.sold_widgets));
        $('#hand_sold_widgets').html(pretty_int(pd.stats.hand_sold_widgets));
        $('#total_cash').html(pretty_int(pd.stats.total_cash));
        $('#bought_upgrades').html(pretty_int(pd.stats.bought_upgrades));
        $('#time_played').html(pretty_int(sec_played));
    }

    /****************************************************************************** 
     * SETUP DISPLAY 
     */

    this.setup_display = function() {
        setup_clickers(); 
        setup_sellers();
        setup_upgrades();   
        setup_banks();
        setup_achievements();
    }

    function setup_achievements() { 
       var sortlist = [];
        for(var k in pd.achievements) { 
            sortlist.push([k, pd.achievements[k].group]);
        } 
        var sorted = sortlist.sort(function(x,y) { return x[1] - y[1] });
        var ac_el = $('#achievements');
        ac_el.html('');

        for(var i in sorted) {
            var k = sorted[i][0];
            var ac = pd.achievements[k];
            var template = $('#tpl_achievement').html();
            var data = {'ac':ac, 'id':k};
            var html = Mustache.to_html(template, data);
            ac_el.prepend(html);
        }    
    }

    function setup_banks() {
       var sortlist = [];
        for(var k in pd.banks) { 
            sortlist.push([k, pd.banks[k].cost]);
        } 
        var sorted = sortlist.sort(function(x,y) { return x[1] - y[1] });
        var bn_el = $('#banks');
        bn_el.html('');

        for(var i in sorted) {
            var k = sorted[i][0];
            var bn = pd.banks[k];
            var template = $('#tpl_bank').html();
            var data = {'bn':bn, 'id':k};
            var html = Mustache.to_html(template, data);
            bn_el.prepend(html);
        }
    }

    function setup_clickers() { 
        var sortlist = [];
        for(var k in pd.clickers) { 
            sortlist.push([k, pd.clickers[k].base_cost]);
        } 
        var sorted = sortlist.sort(function(x,y) { return x[1] - y[1] });

        var cs_el = $('#clickers');
        cs_el.html('');
        
        for(var i in sorted) {
            var k = sorted[i][0];
            var cl = pd.clickers[k];
            var template = $('#tpl_clicker').html();
            var data = {'cl':cl, 'id':k};
            var html = Mustache.to_html(template, data);
            cs_el.prepend(html);
        }
    }

    function setup_sellers() { 
        var sortlist = [];
        for(var k in pd.sellers) { 
            sortlist.push([k, pd.sellers[k].base_cost]);
        } 
        var sorted = sortlist.sort(function(x,y) { return x[1] - y[1] });

        var sl_el = $('#sellers');
        sl_el.html('');
        
        for(var i in sorted) {
            var k = sorted[i][0];
            var sl = pd.sellers[k];
            var template = $('#tpl_seller').html();
            var data = {'sl':sl, 'id':k};
            var html = Mustache.to_html(template, data);
            sl_el.prepend(html);
        }
    }

    function setup_upgrades() {
        var sortlist = [];
        for(var k in pd.upgrades) { 
            sortlist.push([k, pd.upgrades[k].cost]);
        } 
        var sorted = sortlist.sort(function(x,y) { return x[1] - y[1] });
        var upgs_el = $('#upgrades');
        upgs_el.html('');

        for(var i in sorted) { 
            var k = sorted[i][0];
            var upg = pd.upgrades[k];
            var template = $('#tpl_upgrade').html();
            var data = {'upg':upg, 'id':k};
            var html = Mustache.to_html(template, data);
            upgs_el.prepend(html);
        }
    }

    /*******************************************************************************
     * Achievements
     */

    function check_achievements() {
        for(var k in pd.achievements) { 
            var a = pd.achievements[k];
            if(a.unlocked) { 
                continue;
            }
            var pps = a.property.split('.');
            var val = pd;
            for(var i = 0; i<pps.length; i++) { 
                val = val[pps[i]];
            }
            if((val === true)&&(val === a.required)) { 
                unlock_achievement(k);
            }
            else if((val)&&(val >= a.required)) {
                unlock_achievement(k);
            } 
        }
    }

    /*******************************************************************************
     * EVENTS 
     */

    this.check_events = function() {
        for(var k in pd.events) { 
            var rnd = Math.random();
            if(pd.events[k].chance > rnd) { 
                run_event(k);
            }
        } 
    }

    function run_event(evk) { 
        if(pd.events[evk]) {
            eval(pd.events[evk].action);
        }
    }

    // Custom Events ---------------------------------------------------------------


    // Meth found, meth per second * r
    function event_found_meth(r) { 
        var amt = pd.stats.clicker_rps * r;
        if(amt < 100) { amt = 100; }
        pd.widgets.amount += amt;
        good_message('You found an extra barrel of meth, with '
            +pretty_int(amt)+' batches inside!');
    }

    // Cash found, cash per second * r
    function event_found_cash(r) { 
        var amt = (pd.stats.seller_rps * pd.widget_roi) * r;
        if(amt < 100) { amt = 100; }
        pd.cash.amount += amt;
        if(amt > 10000000000) { 
            good_message('A mystery benefactor has contributed $'
                +pretty_int(amt)+' to your cause');
            return;
        }
        if(amt > 10000000) { 
            good_message('You found a truck load of cash, containing $'
                +pretty_int(amt)+' inside!');
            return;
        }
        if(amt > 100000) { 
            good_message('You found a briefcase with $'+pretty_int(amt)+' inside!');
            return;
        }
        good_message('You found some extra cash hidden in a shoe box, worth $'
            +pretty_int(amt)+'!');
    }
    // Meth lost, meth made per second * r
    function event_lose_meth(r) { 
        var amt = (pd.stats.clicker_rps * r);
        if(amt < 1) { 
            return false;
        }
        if(amt > pd.widgets.amount) { 
            amt = pd.widgets.amount;
        }
        pd.widgets.amount -= amt;
        bad_message('About '+pretty_int(amt)+' batches of meth have gone missing...');
        return true;
    }

    // Cash lost, cash income per second * r
    function event_lose_cash(r) { 
        var amt = (pd.stats.seller_rps * pd.widget_roi) * r;
        amt -= get_safe_cash();
        if(amt < 1) { 
            return false;
        }
        if(amt > pd.cash.amount) { 
            amt = pd.cash.amount;
        }
        pd.cash.amount -= amt;
        bad_message('According to accounting, $'+pretty_int(amt)+' has been "lost"');
        return true;
    }

    // Rivals seize cash, cash income per second * r
    function event_rival_lose_cash(r) { 
        var amt = (pd.stats.seller_rps * pd.widget_roi) * r;
        amt -= get_safe_cash();
        if(amt < 1) { 
            return false;
        }
        if(amt > pd.cash.amount) { 
            amt = pd.cash.amount;
        }
        pd.cash.amount -= amt;
        bad_message('A rival cartel has hijacked a sale worth $'+pretty_int(amt)+'!');
        return true;
    }

    // Pay bribe, cash income per second * r
    function event_pay_bribe(r) { 
        var amt = (pd.stats.seller_rps * pd.widget_roi) * r;
        amt -= get_safe_cash();
        if(amt < 1) { 
            return false;
        }
        if(amt > pd.cash.amount) { 
            amt = pd.cash.amount;
        }
        pd.cash.amount -= amt;
        bad_message('You had to pay off a government official with $'+pretty_int(amt));
        return true;
    }

    // Seize cash * n
    function event_dea_seize_cash(n) { 
        var amt = (pd.cash.amount * n);
        amt -= get_safe_cash();
        if(amt < 1) { 
            good_message('The DEA was unable to seize any cash');
            return false;
        }
        pd.cash.amount -= amt;
        bad_message('The DEA has seized $'+pretty_int(amt)+'!');
        return true;
    }

    // Pick a building with > 0.001% risk to seize
    function event_dea_seize_building() {
        var nw = (new Date).getTime();

        if(pd.risk_amount > Math.random()) {
            if((nw - last_bust) < 240000) {
                good_message('You narrowly avoided an altercation with the DEA');
                return false;
            }
            var picks = [];
            for(var k in pd.clickers) { 
                var cl = pd.clickers[k];
                if((cl.amount > 0) && (cl.risk > 0.001)) { 
                    picks.push(k);
                }
            }
            if(picks.length < 1) {
                good_message('The DEA attempted to seize something, but they couldn\'t find anything to seize');
                return false;
            }
            var pick = picks[Math.floor(Math.random()*picks.length)];
            pd.clickers[pick].amount -= 1;
            bad_message('The DEA has seized a '+pd.clickers[pick].label+', it\'s a sad day for meth addicts everywhere :(');
            event_dea_seize_cash(0.1);
            last_bust = nw;
            return true;
        }
        good_message('You were able to negotiate your way out of a DEA raid');
        return false;
    }
} // END - Game()



/*******************************************************************************
 * Messaging 
 */

function add_message(msg, _type) { 
    var el = $("<div></div>");
    el.html(msg);
    el.addClass(_type);
    $('#last_message').html($(el).clone().wrap('<p>').parent().html());
    $('#messages').prepend(el);
    //el.fadeOut(100000);
    if($('#messages div').length > 45) { 
        $('#messages div:last').remove();
    }
}
function error(msg) { 
    add_message('&#10007; '+msg, 'error');    
}
function message(msg) { 
    add_message('&#9993; '+msg, 'message');
}
function good_message(msg) { 
    add_message('&#9733; '+msg, 'good_message');
}
function bad_message(msg) { 
    add_message('&#10007; '+msg, 'bad_message');
}

/*******************************************************************************
 * Tab control
 */
function switch_tab(tbid) {
    var tb_el = $('#'+tbid+'_div');
    $('.tab_div').hide();
    $('.tab').removeClass('active');
    $('#'+tbid+'_tab').addClass('active');
    tb_el.show();
    active_tab = tbid;
    return false;
}

function toggle_tab(tbid) { 
    $('#'+tbid+'_div').toggle(200);
    return false;
}

function pretty_int(num) {
    if(num < 1000) { 
        num = Math.round(num * 10) / 10;
    } else { 
        num = Math.round(num);
    }
    var num_str = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); 
    return num_str;
}

