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
var last_saved = 0;
var last_click = 0;
var last_bust = 0;
var last_float = 10;
{% if isapp %}
var tick_ms = 250;
{% else %}
var tick_ms = 100;
{% endif %}
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
        'risk2_amount':0,
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
            { 
                'level':100000000000000000,
                'label':'certain (!!)',
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
                100: 'FDA Approved Additive',
                159: 'Atomically Perfect',
                211: 'Holy',
                300: 'Angelic',
                1000: 'Nectar of The Gods',
            },
        },

        // BANKS
        'banks':{
            'b_lemonade':{
                'amount':0,
                'label':'Lemonade Stand',
                'description':'Launder minimal cash through a lemonade stand',
                'rps':1,
                'unlock_rps':1,
                'cost':200,
                'base_cost':200,
                'unlocked':true,
                'sid':'b1',
            },
            'b_nail_salon':{
                'amount':0,
                'label':'Nail Salon',
                'description':'Purchase a nail salon to launder a small amount of cash',
                'rps':12,
                'unlock_rps':5,
                'cost':8000,
                'base_cost':8000,
                'unlocked':false,
                'sid':'b2',
            },
            'b_banana_stand':{
                'amount':0,
                'label':'Banana Stand',
                'description':'Invest in a banana stand for your laundering pleasure',
                'rps':120,
                'unlock_rps':12,
                'cost':100000,
                'base_cost':100000,
                'unlocked':false,
                'sid':'b3',
            },
            'b_chicken_place':{
                'amount':0,
                'label':'Chicken Restaurant',
                'description':'Invest in a fried chicken restaurant to safely launder a fair amount of cash',
                'rps':1500,
                'unlock_rps':150,
                'cost':1000000,
                'base_cost':1000000,
                'unlocked':false,
                'sid':'b4',
            },
            'b_laser_tag':{
                'amount':0,
                'label':'Laser Tag Theme Park',
                'description':'Launder money through laser tag!',
                'rps':16000,
                'unlock_rps':500,
                'cost':10000000,
                'base_cost':10000000,
                'unlocked':false,
                'sid':'b5',
            },
            'b_car_wash':{
                'label':'Car Wash',
                'amount':0,
                'description':'Launder cash through an overpriced car wash',
                'rps':220000,
                'unlock_rps':5000,
                'cost':100000000,
                'base_cost':100000000,
                'unlocked':false,
                'sid':'b6',
            },
            'b_donations':{
                'label':'Online Donations',
                'amount':0,
                'description':'Launder cash through an online donation network',
                'rps':5200000,
                'unlock_rps':50000,
                'cost':500000000,
                'base_cost':500000000,
                'unlocked':false,
                'sid':'b7',
            },
            'b_offshore': {
                'label':'Offshore Account',
                'amount':0,
                'description':'Launder cash using an offshore finance account',
                'rps':60000000,
                'unlock_rps':500000,
                'cost':4500000000,
                'base_cost':4500000000,
                'unlocked':false,
                'sid':'b8',
            },
            'b_nyme': {
                'label':'NYME',
                'amount':0,
                'description':'Launder high volumes of cash through stocks and bonds on '
                    + 'the New York Meth Exchange ',
                'rps':750000000,
                'unlock_rps':5000000,
                'cost':50500000000,
                'base_cost':50500000000,
                'unlocked':false,
                'sid':'b9',
            },
            'b_franchise': {
                'label':'Food Franchise',
                'amount':0,
                'description':'Why launder through a restaurant, '
                    + 'when you can launder through an entire franchise? ',
                'rps':4550000000,
                'unlock_rps':15000000,
                'cost':150500000000,
                'base_cost':150500000000,
                'unlocked':false,
                'sid':'b10',
            },
            'b_cantina': {
                'label':'Space Cantina',
                'amount':0,
                'description':'Launder your cash on an intergalactic scale with the Space Cantina',
                'rps':14550000000,
                'unlock_rps':30000000,
                'cost':750500000000,
                'base_cost':750500000000,
                'unlocked':false,
                'sid':'b11',
            },
            'b_resort':{
                'label':'Space Resort',
                'amount':0,
                'description':'Launder your cash through a low gravity spa and resort',
                'rps':200000000000,
                'unlock_rps':50000000,
                'cost':2500500000000,
                'base_cost':2500500000000,
                'unlocked':false,
                'sid':'b12',
            },
            'b_spacecorp':{
                'label':'Space Corp',
                'amount':0,
                'description':'Launder cash through a shady conglomerate that deals in planetary colonisation, asteroid mining, and other technology, with secret ties to the military',
                'rps':1200000000000,
                'unlock_rps':125000000,
                'cost':10000000000000,
                'base_cost':10000000000000,
                'unlocked':false,
                'sid':'b13',
            },
            'b_tv':{
                'label':'The Crystal Methwork',
                'amount':0,
                'description':'Launder through a popular television network, included in every '
                    + 'cable package in the galaxy',
                'rps':10500000000000,
                'unlock_rps':525000000,
                'cost':120000000000000,
                'base_cost':120000000000000,
                'unlocked':false,
                'sid':'b14',
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
                'sid':'c1',
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
                'unlocked':false,
                'sid':'c2',
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
                'sid':'c3',
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
                'unlocked':false,
                'sid':'c4',
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
                'unlocked':false,
                'sid':'c5',
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
                'unlocked':false,
                'sid':'c6',
            },
            '10_under_lab': {
                'label':'Underground Laboratory',
                'description':'A massive hidden laboratory for your discreet cooking needs',
                'amount':0,
                'risk':0.005,
                'rps':2000,
                'base_cost':6250000,
                'cost':6250000,
                'unlock_rps':1000,
                'unlocked':false,
                'sid':'c7',
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
                'unlocked':false,
                'sid':'c8',
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
                'unlocked':false,
                'sid':'c9',
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
                'unlocked':false,
                'sid':'c10',
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
                'unlocked':false,
                'sid':'c11',
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
                'unlocked':false,
                'sid':'c12',
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
                'unlocked':false,
                'sid':'c13',
            },
            'meth_factory':{
                'label':'Industrial Complex',
                'description':'A massive industrial complex with thousands of cooks. '
                    + 'Cautious? Nope! Effective? You\'re Goddamn right',
                'amount':0,
                'risk':0.55,
                'rps':55205000,
                'base_cost':41032501000000,
                'cost':41032501000000,
                'unlock_rps':13000000,
                'unlocked':false,
                'sid':'c14',
            },
            'belt':{
                'label':'Heisenbelt',
                'description':'A series of labs on the outer edges of the solar '
                    + 'system that convert asteroids into pure crystal',
                'amount':0,
                'risk':0.000001,
                'rps':492005000,
                'base_cost':410302501000000,
                'cost':410302501000000,
                'unlock_rps':53000000,
                'unlocked':false,
                'sid':'c15',
            },
            'c_planet':{
                'label':'Planetary Meth Replicator',
                'description':'Convert all of a planet\'s matter into pure crystal',
                'amount':0,
                'risk':0.000001,
                'rps':1590000000,
                'base_cost':1910000000000000,
                'cost':1910000000000000,
                'unlock_rps':110000000,
                'unlocked':false,
                'sid':'c16',
            },
            'c_portal':{
                'label':'Portal to The Crystalverse',
                'description':'Attempt to open a portal to another universe full of '
                    + 'Cookies, err... Crystal Meth',
                'amount':0,
                'risk':0.1,
                'rps':21590000000,
                'base_cost':21910000000000000,
                'cost':21910000000000000,
                'unlock_rps':2090000000,
                'unlocked':false,
                'sid':'c17',
            },
        },
        // END clickers


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
                'sid':'s1',
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
                'unlocked':false,
                'sid':'s2',
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
                'unlocked':false,
                'sid':'s3',
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
                'unlocked':false,
                'sid':'s4',
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
                'unlocked':false,
                'sid':'s5',
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
                'unlocked':false,
                'sid':'s6',
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
                'unlocked':false,
                'sid':'s7',
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
                'unlocked':false,
                'sid':'s8',
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
                'unlocked':false,
                'sid':'s9',
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
                'unlocked':false,
                'sid':'s10',
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
                'unlocked':false,
                'sid':'s11',
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
                'unlocked':false,
                'sid':'s12',
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
                'unlocked':false,
                'sid':'s13',
            },
            'meth_mart':{
                'label':'Meth-Mart',
                'description':'The MM franchise is an easy way to distribute product to shoppers, '
                    +'but it\'s very risky, as you would imagine',
                'amount':0,
                'risk':0.55,
                'rps':55205000,
                'base_cost':41032501000000,
                'cost':41032501000000,
                'unlock_rps':13000000,
                'unlocked':false,
                'sid':'s14',
            },
            // Sneak a ref in the shuttle for fun. 
            'shuttle':{
                'label':'Meth Horizon',
                'description':'According to commander Tony Drake, these '
                    + 'high speed shuttles quickly transport product '
                    + 'from the far edges of the solar system',
                'amount':0,
                'risk':0.00001,
                'rps':492005000,
                'base_cost':410325015000000,
                'cost':410325015000000,
                'unlock_rps':53000000,
                'unlocked':false,
                'sid':'s15',
            },
            's_meth_relay':{
                'label':'Intergalactic Meth Relay',
                'description':'Distribute meth to crank-lovin\' sentient life from '
                    + 'the far reaches of the galaxy',
                'amount':0,
                'risk':0.00001,
                'rps':1590000000,
                'base_cost':1910000000000000,
                'cost':1910000000000000,
                'unlock_rps':110000000,
                'unlocked':false,
                'sid':'s16',
            },
            's_church':{
                'label':'Church of the Crystal',
                'description':'Your meth is pure enough that there are some '
                    + 'who believe Truth can be seen on the crystal\'s surface',
                'amount':0,
                'risk':0.00001,
                'rps':21590000000,
                'base_cost':21910000000000000,
                'cost':21910000000000000,
                'unlock_rps':2090000000,
                'unlocked':false,
                'sid':'s17',
            },
        }, 
        // END sellers


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
                'sid':'u01',
            },
            '01_exhaust_fan':{
                'label':'Exhaust Fan',
                'description':'You can now cook 5 more batches at a time',
                'action':'make_amount',
                'purchased':false,
                'mod':5,
                'cost':100,
                'prereq':'00_air_fresheners',
                'sid':'u02',
            },
            '02_goatee':{
                'label':'Goatee',
                'description':'Your mighty goatee intimidates buyers into buying more product; you can now sell an extra batch at a time',
                'action':'sell_amount',
                'purchased':false,
                'mod':1,
                'cost':10,
                'prereq':null,
                'sid':'u03',
            },
            '03_hvac':{
                'label':'Industrial HVAC',
                'description':'Keep the fumes out. You can now cook 100 more batches at a time',
                'action':'make_amount',
                'purchased':false,
                'mod':100,
                'cost':11050,
                'prereq':'01_exhaust_fan',
                'sid':'u04',
            },
            '04_glasses':{
                'label':'Prescription Glasses',
                'description':'Your nerdy specs make your buyers feel they can trust you more; you can now sell 5 additional batches at a time',
                'action':'sell_amount',
                'purchased':false,
                'mod':5,
                'cost':100,
                'prereq':'02_goatee',
                'sid':'u05',
            },
            '07_hat': { 
                'label':'Porkpie Hat',
                'description':'This early 20th century hat keeps the sun out of your eyes, allowing you to make an additional 50 batches at a time',
                'action':'make_amount',
                'purchased':false,
                'mod':50,
                'cost':500,
                'prereq':'04_glasses',
                'sid':'u06',
            },
            '08_mariachi_band':{
                'label':'Mariachi Band',
                'description':'An authentic narcocorrido band to sing the tale of you and your meth. Allows you to charge an extra $5 per batch',
                'action':'widget_roi',
                'purchased':false,
                'mod':5,
                'cost':17500,
                'prereq':'07_hat',
                'sid':'u07',
            },
            '09_vats':{
                'label':'Brewing Vats',
                'description':'Cook your meth in massive vats like the pros. Allows you to cook an additional 500 batches at a time.',
                'action':'make_amount',
                'purchased':false,
                'mod':500,
                'cost':4507500,
                'prereq':'08_mariachi_band',
                'sid':'u08',
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
                'sid':'u09',
            },
            '13_spinning_rims':{
                'label':'Spinnin\' Rims',
                'description':'Roll with style! Improves the sale rate of your dealers by .2/s',
                'action':'sellers.01_dealer.rps',
                'purchased':false,
                'mod':.2,
                'cost':250,
                'prereq':'11_dealer_business_cards',
                'sid':'u10',
            },
            'dealer_slacks':{
                'label':'Dealer Slacks',
                'description':'Your dealers now wear nice slacks, reducing suspicion by 1%',
                'action':'sellers.01_dealer.risk',
                'purchased':false,
                'mod':-.01,
                'cost':550,
                'prereq':'13_spinning_rims',
                'sid':'u11',
            },
            'mules_1': {
                'label':'Stuffed Mules',
                'description':'Your Drug Mules can now sell an additional 3 batches at a time',
                'action':'sellers.03_drug_mule.rps',
                'purchased':false,
                'mod':3,
                'cost':1250,
                'prereq':'dealer_slacks',
                'sid':'u12',
            },
            'mules_2': {
                'label':'Double Stuffed Mules',
                'description':'Your Drug Mules can now sell an additional 16 batches at a time',
                'action':'sellers.03_drug_mule.rps',
                'purchased':false,
                'mod':16,
                'cost':55000,
                'prereq':'mules_1',
                'sid':'u13',
            },
            'dealer_guns': {
                'label':'Dealer Heat',
                'description':'Now your dealers are packin\' heat, allowing them to safely sell another half-batch at a time',
                'action':'sellers.01_dealer.rps',
                'purchased':false,
                'mod':0.5,
                'cost':8000,
                'prereq':'dealer_slacks',
                'sid':'u14',
            },
            'van_jingle':{
                'label':'Van Jingle',
                'description':'Your drug vans play a catchy jingle to attract more customers, selling 5 more batches at a time',
                'action':'sellers.drug_van.rps',
                'purchased':false,
                'mod':5,
                'cost':16000,
                'prereq':'dealer_guns',
                'sid':'u15',
            },
            'lawyers_sleaze': {
                'label':'Extra Sleaze',
                'description':'Your lawyers are now extra sleazy, and can sell an additional 10 batches at a time',
                'action':'sellers.cheap_lawyer.rps',
                'purchased':false,
                'mod':10,
                'cost':150000,
                'prereq':'van_jingle',
                'sid':'u16',
            },
            'lawyers_better':{
                'label':'Better Lawyers',
                'description':'Your sleazy lawyers now reduce risk by an additional 5%',
                'action':'sellers.cheap_lawyer.risk',
                'purchased':false,
                'mod':-0.05,
                'cost':1175000,
                'prereq':'lawyers_sleaze',
                'sid':'u17',
            },
            'lawyers_best':{
                'label':'Lawyers 2.0',
                'description':'Your sleazy lawyers now use the Chewbacca Defense. They reduce risk by an additional 5%',
                'action':'sellers.cheap_lawyer.risk',
                'purchased':false,
                'mod':-0.05,
                'cost':11275000,
                'prereq':'lawyers_better',
                'sid':'u18',
            },
            'lawyers_super':{
                'label':'Super Lawyers',
                'description':'Your sleazy lawyers now wear a cape. They reduce risk by an additional 5%',
                'action':'sellers.cheap_lawyer.risk',
                'purchased':false,
                'mod':-0.05,
                'cost':210555000,
                'prereq':'lawyers_best',
                'sid':'u19',
            },       
            'lawyers_magic':{
                'label':'Immortal Lawyers',
                'description':'Your lawyers are now demigods. They reduce risk by an additional 10%',
                'action':'sellers.cheap_lawyer.risk',
                'purchased':false,
                'mod':-0.10,
                'cost':164200552000,
                'prereq':'lawyers_super',
                'sid':'u20',
            },
            'better_diplomats': {
                'label':'Diplomatic Immunity',
                'description':'Your diplomats can now sell an extra 1K batches',
                'action':'sellers.09_diplomat.rps',
                'purchased':false,
                'mod':1000,
                'cost':15005000,
                'prereq':'lawyers_sleaze',
                'sid':'u21',
            },
            '21_portable_generator':{
                'label':'Portable Power Generator',
                'description':'Provides extra power to your RVs - adding 0.5 production per second',
                'action':'clickers.03_used_rv.rps',
                'purchased':false,
                'mod':0.5,
                'cost':150,
                'prereq':'01_exhaust_fan',
                'sid':'u22',
            },
            'shed_power':{
                'label':'Shed Propane',
                 'description':'Outfit your Storage Sheds with propane and propane accessories. They cook another 0.8 batches at a time',
                'action':'clickers.01_storage_shed.rps',
                'purchased':false,
                'mod':0.8,
                'cost':9500,
                'prereq':'21_portable_generator',
                'sid':'u23',
            },
            'rv_solar':{
                'label':'RV Solar Panels',
                'description':'Harness the power of the sun! Allows your RV cooks to make an additional 2.5 batches at a time',
                'action':'clickers.03_used_rv.rps',
                'purchased':false,
                'mod':2.5,
                'cost':1250,
                'prereq':'shed_power',
                'sid':'u24',
            },
            'camper_lab':{
                'label':'Mobile Lab',
                'description':'Completely outfit your RVs for maximum meth production, netting you 16 extra batches at a time',
                'action':'clickers.03_used_rv.rps',
                'purchased':false,
                'mod':16,
                'cost':55000,
                'prereq':'rv_solar',
                'sid':'u25',
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
                'sid':'u26',
            },

            '23_personal_enforcer':{
                'label':'Personal Enforcer',
                'description':'Hire a personal enforcer to prevent your shit from getting stolen, you can now sell an extra 100 batches at a time',
                'action':'sell_amount',
                'purchased':false,
                'mod':100,
                'cost':15000,
                'prereq':'22_hazmat_suit',
                'sid':'u27',
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
                'sid':'u28',
            },
            '32_gas_stove':{
                'label':'Gas Stove',
                'description':'Improves meth purity by 0.5 IPU',
                'cost':120,
                'action':'widget_roi',
                'mod':0.5,
                'purchased':false,
                'prereq':null,
                'sid':'u29',
            },
            '33_steel_burner':{
                'label':'Steel Burners',
                'description':'Improves meth purity by another 0.5 IPU',
                'cost':240,
                'action':'widget_roi',
                'mod':0.5,
                'purchased':false,
                'prereq':'32_gas_stove',
                'sid':'u30',
            },
            '34_titanium_burner':{
                'label':'Titanium Burners',
                'description':'Spaceship-grade burners improve meth purity by 1 IPU',
                'cost':3550,
                'action':'widget_roi',
                'mod':1,
                'purchased':false,
                'prereq':'33_steel_burner',
                'sid':'u31',
            },
            '35_platinum_burner':{
                'label':'Platinum Burners',
                'description':'Industrial grade platinum burners improve meth purity by 3 IPUs',
                'cost':23550,
                'action':'widget_roi',
                'mod':3,
                'purchased':false,
                'prereq':'34_titanium_burner',
                'sid':'u32',
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
                'sid':'u33',
            },
            '42_steel_cookware':{
                'label':'Stainless Steel Cookware',
                'description':'Improves meth purity by 0.5 IPU',
                'cost':120,
                'action':'widget_roi',
                'mod':0.5,
                'purchased':false,
                'prereq':null,
                'sid':'u34',
            },
            '43_glass_flasks':{
                'label':'Glass Flasks',
                'description':'Further improves meth purity by another 0.5 IPU',
                'cost':240,
                'action':'widget_roi',
                'mod':0.5,
                'purchased':false,
                'prereq':'42_steel_cookware',
                'sid':'u35',
            },
            '46_hard_glass_boilers':{
                'label':'Hardened Glass Boilers',
                'description':'Further improves meth purity by 1 IPU',
                'cost':1500,
                'action':'widget_roi',
                'mod':1,
                'purchased':false,
                'prereq':'43_glass_flasks',
                'sid':'u36',
            },
            
            '47_carbon_filters':{
                'label':'Carbon Filtration',
                'description':'Filters out the extra deadly components, adding 3 IPUs',
                'cost':92500,
                'action':'widget_roi',
                'mod':3,
                'purchased':false,
                'prereq':'46_hard_glass_boilers',
                'sid':'u37',
            },
            '49_diamond_flasks':{
                'label':'Diamond Flasks',
                'description':'Further improves purity by 5 IPUs',
                'cost':252500,
                'action':'widget_roi',
                'mod':5,
                'purchased':false,
                'prereq':'46_hard_glass_boilers',
                'sid':'u38',
            },
            '50_platinum_boilers':{
                'label':'Platinum Boilers',
                'description':'Improves purity by 10 IPUs!',
                'cost':2155000,
                'action':'widget_roi',
                'mod':10,
                'purchased':false,
                'prereq':'49_diamond_flasks',
                'sid':'u39',
            },
            '53_space_hazmat':{
                'label':'Space Hazmat Suit',
                'description':'Now you can cook in space! Cook an additional 1000 batches at a time',
                'cost':121550000,
                'action':'make_amount',
                'mod':1000,
                'purchased':false,
                'prereq':'50_platinum_boilers',
                'sid':'u40',
            },
            'personal_snipers':{
                'label':'SWAT Snipers',
                'description':'Your team of highly trained snipers protects you during high-value transactions. Safely sell an additional 1000 batches at a time',
                'cost':321500000,
                'action':'sell_amount',
                'mod':1000,
                'purchased':false,
                'prereq':'50_platinum_boilers',
                'sid':'u41',
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
                'sid':'u42',
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
                'sid':'u43',
            },
            'slap_chop':{
                'label':'Slap Chop (TM)',
                'description':'You\'re gonna love my meth. With this precision '
                    + 'cutting device, you can now make an additional 50% of production '
                    + 'at a time',
                'cost':18100500000,
                'action':'make_rps_multiplier',
                'mod':0.5,
                'purchased':false,
                'prereq':'chem_degree',
                'sid':'u44',
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
                'sid':'u45',
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
                'sid':'u46',
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
                'sid':'u47',
            },
            'u_trick_or_treat': {
                'label':'Trick or Treat',
                'description':'Hand out meth like it\'s candy, and sell an additional 200% of sales at a time',
                'action':'sell_rps_multiplier',
                'purchased':false,
                'mod':2,
                'hidden':true,
                'cost':15000000,
                'prereq':'hidden',
                'sid':'u47.1',
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
                'sid':'u48',
            },
            'methylamine_secret': { 
                'label':'Methylamine X',
                'description':'By unlocking this experimental methylamine-based compound you increase purity by 10 IPUs',
                'cost':126321500000,
                'action':'widget_roi',
                'mod':10,
                'purchased':false,
                'prereq':'ancient_methology',           
                'sid':'u49',
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
                'sid':'u50',
            },
            'quantum_meth':{
                'label':'Quantum Meth',
                'description':'This meth is atomically perfect, alowing you to charge an additional '
                    + '$45 per batch',
                'cost':42100500555000,
                'action':'widget_roi',
                'mod':44.5,
                'purchased':false,
                'prereq':'alien_meth',           
                'sid':'u50.1',               
            },
            'u_holy_meth':{
                'label':'Holy Meth',
                'description':'Your followers feel closer to the heavens when they gaze upon '
                    + 'these holy crystals. Charge another $53 per batch',
                'cost':142100500555000,
                'action':'widget_roi',
                'mod':53,
                'purchased':false,
                'prereq':'alien_meth',           
                'sid':'u50.2',               
            },
            'u_angelic':{
                'label':'Angelic Meth',
                'description':'It is said that the Arch Angels of Methen prefer the taste of your meth',
                'cost':1042100500555000,
                'action':'widget_roi',
                'mod':60,
                'purchased':false,
                'prereq':'u_holy_meth',           
                'sid':'u50.3',               
            },
            // Laundering
            'u_nyme_1':{
                'label':'Insider Trading',
                'description':'Improves NYME laundering by $500m per second ',
                'cost':50020555000,
                'action':'banks.b_nyme.rps',
                'mod':500000000,
                'purchased':false,
                'prereq':'lawyers_sleaze',                          
                'sid':'u51',
            },
            'u_nyme_2': {
                'label':'Sleazy Brokers',
                'description':'These sleazy stock brokers help your NYME launder '
                    + 'an extra $1B per second',
                'cost':500320555000,
                'action':'banks.b_nyme.rps',
                'mod':1000000000,
                'purchased':false,
                'prereq':'u_nyme_1',                          
                'sid':'u52',
            },
            'u_franchise': {
                'label':'Fortune 500 Franchise',
                'description':''
                    + 'Each franchise can now launder an extra $2B per second',
                'cost':590000555000,
                'action':'banks.b_franchise.rps',
                'mod':2000000000,
                'purchased':false,
                'prereq':'u_nyme_2',                          
                'sid':'u53',
            },
            'u_cantina': {
                'label':'Cantina Band',
                'description':''
                    + 'Increase Cantina laundering speed by $5B with live flute music ',
                'cost':1590000555000,
                'action':'banks.b_cantina.rps',
                'mod':5000000000,
                'purchased':false,
                'prereq':'u_franchise',                          
                'sid':'u54',
            },
            'u_spacecorp': {
                'label':'Space Capitalism',
                'description':''
                    + 'Increase Space Corp\'s laundering rate by $0.2T ',
                'cost':2500000555000,
                'action':'banks.b_spacecorp.rps',
                'mod':200000000000,
                'purchased':false,
                'prereq':'u_cantina',                          
                'sid':'u55',
            },
            'donator_thanks':{
                'label':'Thank You',
                'description':'Thanks for donating, your meth is now worth $50 more per batch',
                'cost':321500000,
                'action':'widget_roi',
                'mod':50,
                'purchased':false,
                'prereq':'hidden',
                'sid':'u70',
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
                'sid':'a01',
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
                'sid':'a02',
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
                'sid':'a03',
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
                'sid':'a04',
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
                'sid':'a05',
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
                'sid':'a06',
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
                'sid':'a07',
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
                'sid':'a08',
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
                'sid':'a09',
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
                'sid':'a10',
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
                'sid':'a11',
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
                'sid':'a12',
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
                'sid':'a13',
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
                'sid':'a14',
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
                'sid':'a15',
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
                'sid':'a16',
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
                'sid':'a17',
            },
            'banana_stand': {
                'label':'Frozen Bananas',
                'description':'There\'s always money in the banana stand',
                'property':'banks.b_banana_stand.amount',
                'required':1,
                'unlocked':false,
                'hidden':false,
                'value':1,
                'group':250,
                'min_time':1,
                'sid':'a18',           
            },
            'senate': {
                'label':'Government Shutdown',
                'description':'You\'ve bought the entire senate (100 Crooked Senators)!',
                'property':'sellers.senator.amount',
                'required':100,
                'unlocked':false,
                'hidden':false,
                'value':1,
                'group':228,
                'min_time':1,           
                'sid':'a19',
            },
            'a_franchise': {
                'label':'McLaunder\'s',
                'description':'You\'ve bought a franchise!',
                'property':'banks.b_franchise.amount',
                'required':1,
                'unlocked':false,
                'hidden':false,
                'value':1,
                'group':229,
                'min_time':1,           
                'sid':'a20',
            },
            'a_spacecorp':{
                'label':'Laundering Better Worlds',
                'description':'You\'ve bought a Space Corp!',
                'property':'banks.b_spacecorp.amount',
                'required':1,
                'unlocked':false,
                'hidden':false,
                'value':1,
                'group':240,
                'min_time':1,
                'sid':'a21',
            },
            'a_playtime1':{
                'label':'A Minute of Your Time',
                'description':'You\'ve managed a meth lab for 1 minute',
                'property':'stats.seconds_played',
                'required':60,
                'unlocked':false,
                'hidden':false,
                'value':1,
                'group':301,
                'min_time':1,
                'sid':'a22',
            },
            'a_playtime2':{
                'label':'Five Minutes of Fame',
                'description':'You\'ve managed a meth lab for 5 minutes',
                'property':'stats.seconds_played',
                'required':300,
                'unlocked':false,
                'hidden':false,
                'value':2,
                'group':302,
                'min_time':1,
                'sid':'a23',
            },
            'a_playtime3':{
                'label':'First Lab Hour',
                'description':'You\'ve managed a meth lab for an hour',
                'property':'stats.seconds_played',
                'required':3600,
                'unlocked':false,
                'hidden':false,
                'value':3,
                'group':303,
                'min_time':1,
                'sid':'a24',
            },
            'a_playtime4':{
                'label':'Half a day down the drain',
                'description':'You\'ve managed a meth empire for 12 hours',
                'property':'stats.seconds_played',
                'required':43200,
                'unlocked':false,
                'hidden':false,
                'value':5,
                'group':304,
                'min_time':1,
                'sid':'a25',
            },
            'a_playtime5':{
                'label':'Addict',
                'description':'You\'ve managed a meth empire for an entire day',
                'property':'stats.seconds_played',
                'required':86400,
                'unlocked':false,
                'hidden':false,
                'value':10,
                'group':305,
                'min_time':1,
                'sid':'a26',
            },
            'a_playtime6':{
                'label':'Junkie',
                'description':'You\'ve managed a meth empire for an entire week!',
                'property':'stats.seconds_played',
                'required':86400*5,
                'unlocked':false,
                'hidden':false,
                'value':10,
                'group':306,
                'min_time':1,
                'sid':'a27',
            },
            'a_playtime7':{
                'label':'Burnout',
                'description':'You\'ve managed a meth empire for a month! Dayum!',
                'property':'stats.seconds_played',
                'required':86400*30,
                'unlocked':false,
                'hidden':false,
                'value':10,
                'group':307,
                'min_time':1,
                'sid':'a28',
            },
            'a_spent_million':{
            	'label':'Kardashian',
            	'description':'You\'ve spent your first $1,000,000!',
            	'property':'stats.total_spent',
            	'required':1000000,
            	'unlocked':false,
            	'hidden':false,
            	'value':1,
            	'group':315,
            	'min_time':1,
            	'sid':'a29',
            },
            'a_spent_billion':{
            	'label':'Kanye',
            	'description':'You\'ve spent your first $1,000,000,000!',
            	'property':'stats.total_spent',
            	'required':1000000000,
            	'unlocked':false,
            	'hidden':false,
            	'value':5,
            	'group':316,
            	'min_time':1,
            	'sid':'a30',
            },
            'a_spent_trillion':{
            	'label':'The Fed',
            	'description':'You\'ve spent your first $1,000,000,000,000!',
            	'property':'stats.total_spent',
            	'required':1000000000000,
            	'unlocked':false,
            	'hidden':false,
            	'value':10,
            	'group':317,
            	'min_time':1,
            	'sid':'a31',
            },
            'a_spent_quadrillion':{
            	'label':'THE High Roller',
            	'description':'You\'ve spent your first $1 Quadrillion!',
            	'property':'stats.total_spent',
            	'required':1000000000000000,
            	'unlocked':false,
            	'hidden':false,
            	'value':15,
            	'group':318,
            	'min_time':1,
            	'sid':'a32',
            },
            'a_spent_quintillion':{
            	'label':'Fortune 1',
            	'description':'You\'ve spent your first $1 Quintillion!',
            	'property':'stats.total_spent',
            	'required':1000000000000000000,
            	'unlocked':false,
            	'hidden':false,
            	'value':25,
            	'group':319,
            	'min_time':1,
            	'sid':'a33',
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
                'sid':'a101',
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
                'sid':'a102',
            },

        },

        // EVENTS
        'events': { 
            'cash_found_small':{
                'chance':0.04,
                'action':'event_found_cash(60)',
            },
            'cash_found_med': {
                'chance':0.005,
                'action':'event_found_cash(240)',
            },
            'cash_found_large': {
                'chance':0.001,
                'action':'event_found_cash(640)',
            },
            'meth_found_small':{
                'chance':0.04,
                'action':'event_found_meth(120)',
            },
            'building_seized':{
                'chance':0.2,
                'action':'event_dea_seize_building()',
            },
            'cash_lost': { 
                'chance':0.007,
                'action':'event_lose_cash(60)',
            },
            'rival_cash_lost': { 
                'chance':0.005,
                'action':'event_rival_lose_cash(205)',
            },
            'pay_bribe':{
                'chance':0.01,
                'action':'event_pay_bribe(125)',
            },
            'lose_meth':{
                'chance':0.005,
                'action':'event_lose_meth(125)',
            },
            'irs_audit_1': { 
                'chance':0.18,
                'action':'event_irs_audit(0.5)',
            },
            
        },
        // STATISTICS
        'stats': {
            'seller_rps':0,
            'clicker_rps':0,
            'bank_rps':0,
            'cheated_widgets':0,
            'cheated_cash':0,
            'hand_made_widgets':0,
            'made_widgets':0,
            'sold_widgets':0,
            'hand_sold_widgets':0,
            'seconds_played':0,
            'bought_upgrades':0,
            'total_cash':0,
            'total_spent':0,
            'start_time':(new Date).getTime(),
        },
    };


    // error_log() - Send a Game() specific error
    this.error_log = function(msg) { 
        error_log(msg, this.get_debug_data());
    }

    this.get_debug_data = function() { 
        return {
            'cash':pd.cash.amount,
            'widgets':pd.widgets.amount,
            'safe_cash':pd.cash.safe,
            'make_amount':pd.make_amount,
            'sell_amount':pd.sell_amount,
        }
    }

    // sec_tick() - Runs every 1000ms 
    this.sec_tick = function() {
        fix_saved();
        fix_stats();
        check_achievements();
    }

    // tick() - Runs every tick_ms (default 100ms)
    this.tick = function() { 
 
        var this_tick = (new Date).getTime();
        var this_sub = 1000 / tick_ms;
        var ticks = Math.round((this_tick - last_tick) / tick_ms);
        if(ticks > 360000) { 
            ticks = 360000;
        } else if (ticks < 1) { 
            return;
        }
        last_tick = this_tick;

        // Negative fix
        if(pd.cash.amount < 0) { 
            this.error_log('negative_cash: '+pd.cash.amount);
            pd.cash.amount = 0;
        } 
        if(pd.widgets.amount < 0) { 
            this.error_log('negative_widgets: '+pd.widgets.amount);
            pd.widgets.amount = 0;
        }
        if(pd.cash.safe < 0) {
            this.error_log('negative_safe_cash: '+pd.cash.safe);
            pd.cash.safe = 0;
        }

        // Make widgets (meth)
        var make_amount = 0;
        for(var k in pd.clickers) {
            var cl = pd.clickers[k]; 
            make_amount += cl.amount * cl.rps;
        }
        pd.stats.clicker_rps = make_amount;
        make_amount = make_amount / this_sub;
        do_make(make_amount * ticks);
      
        // Sell widgets
        var sell_amount = 0;
        for(var k in pd.sellers) { 
            var sl = pd.sellers[k];
            sell_amount += sl.amount * sl.rps;
        }
        pd.stats.seller_rps = sell_amount;
        sell_amount = sell_amount / this_sub;

        do_sell(sell_amount * ticks);

        // Safe-ify (launder) cash
        var safe_amount = 0;
        for(var k in pd.banks) { 
            var bn = pd.banks[k];
            safe_amount += bn.amount * bn.rps;
        }
        pd.stats.bank_rps = safe_amount;
        safe_amount = safe_amount / this_sub;
        pd.cash.safe += safe_amount * ticks;
        if(pd.cash.safe > pd.cash.amount) { 
            pd.cash.safe = pd.cash.amount;
        }

        fix_display();
    }

    // Earn cash
    function earn_cash(n) { 
        pd.cash.amount += n;
        return true;
    }

    // Spend cash
    function spend_cash(n) {
        if(n > (pd.cash.amount)) {
            return false;
        } 
        pd.cash.amount -= n;
        pd.stats.total_spent += n;
        return true;
    }

    // Version check
    this.check_version = function() { 
        $.get('/version.json',
            function(data) { 
                if(data.data.version) {
                    if(data.data.version > pd.version) { 
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
    // Secondary risk levels, IRS in this case
    function get_risk2() {
        if(pd.cash.amount <= 20000) { 
            return 0;
        }
        if(pd.cash.safe > pd.cash.amount) { 
            return 0;
        }
        return 0.5 - (pd.cash.safe / pd.cash.amount);
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
    this.dump_pd = function(key) { 
        console.log(pd[key]);
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
        if(pd.cash.safe > pd.cash.amount) {
            return pd.cash.amount;
        } else { 
            return pd.cash.safe;
        }
    }

    function get_unsafe_cash() { 
        var unsafe = pd.cash.amount - pd.cash.safe;
        if(unsafe < 0) { unsafe = 0; }
        return unsafe;
    }

    function get_hex_from_int(n) { 
        return n.toString(24);
    }
    function get_int_from_hex(s) { 
        return parseInt(s, 24);
    }
    
    function pd_to_json() { 
        // Convert the current game state to a JSON object suitable for saves,
        // backups, etc.
        var sv = {
            'cash':Math.round(pd.cash.amount),
            'cash_safe':Math.round(pd.cash.safe),
            'widgets':Math.round(pd.widgets.amount),
            'clickers':{},
            'sellers':{},
            'upgrades':{},
            'banks':{},
            'stats':pd.stats,
            'version':pd.version,
        };
    
        // Banks
        for(var k in pd.banks) { 
            if(pd.banks[k].unlocked) {
                sv.banks[k] = {
                    'amount':pd.banks[k].amount,
                    'unlocked':pd.banks[k].unlocked,
                };
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
        return sv;
    }
    function new_pd_to_json() { 
        var sdata = {
            'c':get_hex_from_int(Math.round(pd.cash.amount)),
            'cs':get_hex_from_int(Math.round(pd.cash.safe)),
            'w':get_hex_from_int(Math.round(pd.widgets.amount)),
        };
       
        var unlockables = {
            "clickers":"cl",
            "sellers":"sl",
            "banks":"bn",
        };
        for(var k in unlockables) { 
            var items = pd[k];
            var sk = unlockables[k];
            var tmpa = [];
            for(var ik in items) { 
                if(items[ik].unlocked) {
                    tmpa.push(
                        items[ik].sid
                        + ":" +
                        get_hex_from_int(items[ik].amount)
                    ); 
                }
            }
            sdata[sk] = tmpa.join('|');
        }
        // Upgrades
        var tmpu = [];
        for(var k in pd.upgrades) { 
            var u = pd.upgrades[k];
            if(u.purchased) { 
                tmpu.push(u.sid); 
            }
        }
        sdata['u'] = tmpu.join('|')

        // Stats
        var tmps = [];
        for(var k in pd.stats) { 
            tmps.push(k+':'
                +get_hex_from_int(pd.stats[k])
            );
        }
        sdata['s'] = tmps.join('|');
        return sdata;
    }


    function ac_to_json() { 
        // Convert achievements to a suitable state for save, backup, etc.
        var ac = [];
        for(var k in pd.achievements) { 
            if(pd.achievements[k].unlocked) { 
                ac.push(k);
            }
        }
        return ac;
    }

    function new_ac_to_json() { 
        var ac = [];
        for(var k in pd.achievements) { 
            if(pd.achievements[k].unlocked) { 
                ac.push(pd.achievements[k].sid);
            }
        }
        return ac.join('|');
    }

    function update_save_from_pd() { 
        localStorage.sv = JSON.stringify(pd_to_json());
        localStorage.ac = JSON.stringify(ac_to_json());
    }
    function new_update_save_from_pd() {
        localStorage.sv2 = Base64.encode(JSON.stringify(new_pd_to_json()));
        localStorage.ac2 = Base64.encode(JSON.stringify(new_ac_to_json()));
    }

    function update_pd_from_json(sv) {
        // Load a saved JSON object back into the game.
        pd.cash.amount = sv.cash;
        if(sv.cash_safe) { pd.cash.safe = sv.cash_safe; }
        pd.widgets.amount = sv.widgets;
        $.extend(pd.stats, sv.stats);
        // Banks
        if(sv.banks) {
            for(var k in sv.banks) { 
                if(pd.banks[k]) {
                    pd.banks[k].amount = sv.banks[k].amount;
                    pd.banks[k].unlocked = sv.banks[k].unlocked;
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
    function new_update_pd_from_json(sv) { 
        pd.cash.amount = get_int_from_hex(sv.c);
        if(sv.cs) { pd.cash.safe = get_int_from_hex(sv.cs); }
        pd.widgets.amount = get_int_from_hex(sv.w);
        // Banks, Sellers, Clickers
        var unlockables = {
            'banks':'bn',
            'clickers':'cl',
            'sellers':'sl',
        };

        for(var uk in unlockables) {
            var sk = unlockables[uk];
            if(sv[sk]) { 
                var bns = sv[sk].split('|');
                for(var i=0; i<bns.length; i++) {
                    var bid = bns[i].split(':');
                    for(var k in pd[uk]) {
                        if(pd[uk][k].sid == bid[0]) { 
                            pd[uk][k].amount = get_int_from_hex(bid[1]);
                            pd[uk][k].unlocked = true;
                        } 
                    }
                }
            }
        }

        // Upgrades
        var upgs = sv.u.split('|');
        for(var k in pd.upgrades) { 
            var upg = pd.upgrades[k];
            if(upgs.indexOf(upg.sid) > -1) {
                apply_upgrade(k);
            }
        }
        // Stats
        var svs = sv.s.split('|');
        for(var k in pd.stats) { 
            for(var i=0; i<svs.length; i++) { 
                var svsp = svs[i].split(':');
                if(svsp[0] == k) {
                   pd.stats[k] = get_int_from_hex(svsp[1]);
                }
            }
        }
    }

    function update_ac_from_json(ac) {
        // Load a saved JSON object with achievements back into the game.
        for(var i=0; i<ac.length; i++) {
            if(pd.achievements[ac[i]]) { 
                pd.achievements[ac[i]].unlocked = true;
            }
        }
    }
    function new_update_ac_from_json(ac) {
        ac = ac.split('|');
        for(var k in pd.achievements) { 
            if(ac.indexOf(pd.achievements[k].sid) > -1) { 
                pd.achievements[k].unlocked = true;
            } 
        }
    }

    function update_pd_from_save() { 
        // Achievements
        if(localStorage.ac) { 
            var ac = $.parseJSON(localStorage.ac);
            update_ac_from_json(ac);
        }

        if(localStorage.sv) { 
            var sv = $.parseJSON(localStorage.sv);
            update_pd_from_json(sv);
        } 
    }
    function new_update_pd_from_save() { 
        // Achievements
        if(localStorage.ac2) { 
            var ac = $.parseJSON(Base64.decode(localStorage.ac2));
            new_update_ac_from_json(ac);
        }
        if(localStorage.sv2) { 
            var sv = $.parseJSON(Base64.decode(localStorage.sv2));
            new_update_pd_from_json(sv);
        } 
    }

    /****************************************************************************** 
     * ACTIONS
     */

    // Expose "add_cash" for cheaters
    this.add_cash = function(n) { 
        earn_cash(n);
        pd.stats.cheated_cash += n;
    }

    // Expose "add_widgets" for cheaters
    this.add_widgets = function(n) { 
        pd.widgets.amount += n;
        pd.stats.cheated_widgets += n;
    }
    
    this.do_save = function() {
        //update_save_from_pd();
        new_update_save_from_pd();
        last_saved = 0;
        track_page_view('/game_save');
    }

    this.do_load = function() { 
        if((localStorage.sv2)||(localStorage.ac2)) { 
            //update_pd_from_save();
            new_update_pd_from_save();
            message('Game loaded!');
            track_page_view('/game_load');
        }
    }

    this.do_export = function() {
        var exdata = {
            'sv': new_pd_to_json(),
            'ac': new_ac_to_json()
        };
        var exdata_json = JSON.stringify(exdata);
        var exdata_base64 = Base64.encode(exdata_json);
        $('#impexp').val(exdata_base64);
        message('Game exported!');
    }

    this.do_import = function() { 
        var imptxt = $('#impexp').val();
        if(!imptxt) { 
            return false;
        }
        if(imptxt == 'THANK YOU!') {
            good_message('You have unlocked the "Thank You" hidden upgrade'); 
            apply_upgrade('donator_thanks');
            return;
        }
        var exdata_json = Base64.decode($.trim(imptxt));
        var exdata = $.parseJSON(exdata_json);
        new_update_ac_from_json(exdata.ac);
        new_update_pd_from_json(exdata.sv);
        message('Game imported!');
    }

    this.do_reset = function() { 
        localStorage.removeItem("sv2");
        message('Game reset');
        track_page_view('/game_reset');
        location.reload();
    }
    this.do_reset_all = function() { 
        localStorage.clear();
        message('Game reset - all');
        track_page_view('/game_reset_all');
        location.reload();
    }

    this.do_reset_confirm = function() { 
        var ok = confirm('Are you sure? You\'ll lose everything '
            + 'except Achievements.');
        if(ok) { 
            this.do_reset();
        }
    }
    this.do_reset_all_confirm = function() { 
        var ok = confirm('Are you sure? You\'ll lose everything, '
            + 'including Achievements.');
        if(ok) { 
            this.do_reset_all();
        }
    }

    function do_make(n) {
        pd.widgets.amount += n;   
        pd.stats.made_widgets += n; 
        return true;
    }

    this.do_make_click = function() { 
        {% if not isapp %}
        var nw = (new Date).getTime();
        if((nw - last_click) < 70) { 
            return false;
        }
        last_click = nw;
        {% endif %}
        var amt = this.get_click_make_amount();
        if(do_make(amt)) { 
            //message('You made '+pretty_int(pd.make_amount)+' '+pd.widgets.label);
            pd.stats.hand_made_widgets += amt;
            fix_make_sell();
        }
    }

    function do_sell(n) { 
        if(pd.widgets.amount < 1) {
            return 0;
        }         
        if(n > pd.widgets.amount) {
            n += (pd.widgets.amount - n);
            if(n < 1) { 
                return 0;
            } 
        }
        pd.stats.sold_widgets += n;
        pd.widgets.amount -= n;
        earn_cash(n * pd.widget_roi);
        pd.stats.total_cash += (n * pd.widget_roi);
        return n;
    }

    this.do_sell_click = function() {
        {% if not isapp %}
        var nw = (new Date).getTime();
        if((nw - last_click) < 70) {
            return false;
        } 
        last_click = nw;
        {% endif %}
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
        if(!spend_cash(bn.cost)) { 
            return false;
        }
        bn.amount += 1;
        message('You have purchased a '+bn.label+' for $'+pretty_bigint(bn.cost));
        //track_page_view('/game_buy_bank');
        return true;
    }

    this.sell_bank = function(key) { 
        var bn = pd.banks[key];
        if(bn.amount < 1) { 
            return false;
        }
        var sell_val = get_item_sell_value(bn);
        earn_cash(sell_val);
        message('You sold a '+bn.label+' for $'+pretty_bigint(sell_val));
        //track_page_view('/game_sell_bank');
        bn.amount -= 1;
        return true;
    }

    this.buy_clicker = function(key) { 
        var cl = pd.clickers[key];
        if(!spend_cash(cl.cost)) { 
            return false;
        }
        cl.amount += 1;
        message('You have purchased a '+cl.label+' for $'+pretty_bigint(cl.cost));
        fix_clickers();
        //track_page_view('/game_buy_clicker');
        return true;
    }

    this.sell_clicker = function(key) { 
        var cl = pd.clickers[key];
        if(cl.amount < 1) { 
            return false;
        }
        var sell_val = get_item_sell_value(cl);
        earn_cash(sell_val);
        message('You sold a '+cl.label+' for $'+pretty_bigint(sell_val));
        //track_page_view('/game_sell_clicker');
        cl.amount -= 1;
        return true;
    }

    this.buy_seller = function(key) { 
        var sl = pd.sellers[key];
        if(!spend_cash(sl.cost)) { 
            return false;
        }
        sl.amount += 1;
        message('You have purchased a '+sl.label+' for $'+pretty_bigint(sl.cost));
        fix_sellers();
        //track_page_view('/game_buy_seller');
        return true;
    }

    this.sell_seller = function(key) { 
        var sl = pd.sellers[key];
        if(sl.amount < 1) { 
            return false;
        }
        var sell_val = get_item_sell_value(sl);
        earn_cash(sell_val);
        message('You sold a '+sl.label+' for $'+pretty_bigint(sell_val));
        //track_page_view('/game_sell_seller');
        sl.amount -= 1;
        return true;
    }

    this.buy_upgrade = function(key) { 
        var upg = pd.upgrades[key];
        var unl = apply_upgrade(key);
        if(!unl) { 
            return false;
        }
        if(!spend_cash(upg.cost)) {
            return false; 
        } 
        message('You have unlocked '+upg.label+' for $'+pretty_bigint(upg.cost));
        track_page_view('/game_buy_upgrade');
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
        if(active_tab != 'achievements') { 
            return false;
        }
        for(var k in pd.achievements) { 
            var ac = pd.achievements[k];
            var el = $('#'+k);
            var el_lbl = $('#'+k+'_lbl');
            if((ac.hidden)&&(!ac.unlocked)) {
                el.addClass('hidden'); 
                continue;
            }
            if(ac.unlocked) { 
                el.removeClass('hidden');
                el.removeClass('semi_trans');
                el_lbl.addClass('purchased');
                el.removeClass('locked');
            } else { 
                el.addClass('locked');
                el.addClass('semi_trans');
            }
        }

    }

    function fix_banks() {
        if(active_tab != 'banks') { 
            return; 
        }

        $('#bank_rps').html(pretty_bigint(pd.stats.bank_rps));
        $('#bank_total').html(pretty_bigint(pd.cash.safe));
        for(var k in pd.banks) {
            var bn = pd.banks[k];
            bn.cost = get_item_cost(bn);
            var el = $('#'+k);
            var el_btn = $('#'+k+'_btn');
            var el_sell_btn = $('#'+k+'_sell_btn');
            var el_lbl = $('#'+k+'_lbl');
            var el_cst = $('#'+k+'_cst');
            var el_amt = $('#'+k+'_amt');
            var el_rps = $('#'+k+'_rps');
        
            el_amt.html(pretty_int(bn.amount));
            el_cst.html(pretty_bigint(bn.cost));
            el_rps.html(pretty_bigint(bn.rps));

            if((!bn.unlocked)) { 
                el.addClass('hidden');
                continue;
            }
            
            if(pd.cash.amount < bn.cost) {
                el_btn.attr('disabled',true);
            } else { 
                el_btn.attr('disabled',false);
            }

            if(bn.amount < 1) {
                el_sell_btn.attr('disabled',true);
            } else { 
                el_sell_btn.attr('disabled',false);
            }
                
            el.removeClass('hidden');
        }
    }

    function fix_risk() { 
        pd.risk_amount = get_risk();
        pd.risk2_amount = get_risk2();
        $('#risk_amount').html(pretty_int(pd.risk_amount * 100)); 
        $('#risk2_amount').html(pretty_int(pd.risk2_amount * 100));
        var el_lvl = $('#risk_level');
        var el_lvl2 = $('#risk2_level');
        var slvl = false;
        var slvl2 = false;
        for(var i=0; i<pd.risk_levels.length; i++) {
            if((pd.risk_amount < pd.risk_levels[i].level) && (!slvl)) {
                el_lvl.html(pd.risk_levels[i].label);
                slvl = true;
            }
            if((pd.risk2_amount < pd.risk_levels[i].level) && (!slvl2)) { 
                el_lvl2.html(pd.risk_levels[i].label);
                slvl2 = true;
            }
        }
        
    }

    function fix_saved() { 
        last_saved += 1;
        $('#last_saved').html('Game saved '+last_saved+' seconds ago');
    }

    function fix_title() { 
        document.title = '$'+pretty_bigint(pd.cash.amount)+' | '+pd.title;
    }

    function fix_make_sell() { 
        $('#sell_btn').html(pd.cash.action_label);
        $('#sell_lbl').html(pd.cash.label);
        $('#sell_amt').html(pretty_int(pd.cash.amount));
        $('#sell_roi').html(pd.widget_roi.toFixed(2));
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
        if(active_tab != 'clickers') {
            return false;
        } 
        for(var k in pd.clickers) { 
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
                el.removeClass('hidden');
            }
            el_cst.html(pretty_bigint(cl.cost));
            el_amt.html(pretty_int(cl.amount));
            el_rps.html(pretty_bigint(cl.rps));
            el_rsk.html(pretty_int(cl.risk * 100));
        }
    }

    function fix_sellers() {
        if(active_tab != 'sellers') { 
            return;
        } 
        for(var k in pd.sellers) { 
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
            }
            el_cst.html(pretty_bigint(sl.cost));
            el_amt.html(pretty_int(sl.amount));
            el_rps.html(pretty_bigint(sl.rps));
            el_rsk.html(pretty_int(sl.risk * 100));
        }
    }

    function fix_unlocks() {
        // Clickers
        var cl_unl = 0;
        var cl_tot = 0; 
        for(var k in pd.clickers) { 
            cl_tot += 1;
            var cl = pd.clickers[k];
            if(cl.unlock_rps <= pd.stats.seller_rps) { 
                cl.unlocked = true;
                cl_unl += 1;
            }
        }
        $('#clickers_unlocked').html(pretty_int(cl_unl));
        $('#clickers_total').html(pretty_int(cl_tot));

        // Sellers
        var sl_unl = 0;
        var sl_tot = 0;
        for(var k in pd.sellers) { 
            sl_tot += 1;
            var sl = pd.sellers[k];
            if(sl.unlock_rps <= pd.stats.seller_rps) {
                sl_unl += 1;
                sl.unlocked = true;        
            }
        }
        $('#sellers_unlocked').html(pretty_int(cl_unl));
        $('#sellers_total').html(pretty_int(cl_tot));

        // Banks
        var bn_unl = 0;
        var bn_tot = 0;
        for(var k in pd.banks) { 
            bn_tot += 1;
            var bn = pd.banks[k];
            if((bn.unlock_rps <= pd.stats.seller_rps)||(bn.unlocked)) { 
                bn_unl += 1;
                bn.unlocked = true;
            }
        }
        $('#banks_total').html(pretty_int(bn_tot));
        $('#banks_unlocked').html(pretty_int(bn_unl));

        // Achievements
        var ac_unl = 0;
        var ac_tot = 0;
        for(var k in pd.achievements) { 
            var ac = pd.achievements[k];
            if((!ac.unlocked)&&(ac.hidden)) { 
                continue;
            }
            if(ac.unlocked) { 
                ac_unl += 1;
            }
            ac_tot += 1;
        }
        $('#achievements_unlocked').html(pretty_int(ac_unl));
        $('#achievements_total').html(pretty_int(ac_tot));

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
                el_cst.html('$'+pretty_bigint(upg.cost));
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


    function fix_stats() {
        pd.stats.seconds_played += 1;
        pd.stats.bought_upgrades = 0;
        for(var k in pd.upgrades) { 
            if(pd.upgrades[k].purchased) { 
                pd.stats.bought_upgrades += 1;
            }
        }
        
        if(active_tab != 'misc') { return; }
        $('#hand_made_widgets').html(pretty_bigint(pd.stats.hand_made_widgets));
        $('#made_widgets').html(pretty_bigint(pd.stats.made_widgets));
        $('#sold_widgets').html(pretty_bigint(pd.stats.sold_widgets));
        $('#hand_sold_widgets').html(pretty_bigint(pd.stats.hand_sold_widgets));
        $('#total_cash').html(pretty_bigint(pd.stats.total_cash));
        $('#total_spent').html(pretty_bigint(pd.stats.total_spent));
        $('#bought_upgrades').html(pretty_int(pd.stats.bought_upgrades));
        $('#time_played').html(pretty_int(pd.stats.seconds_played));
        $('#click_sell_amount').html(pretty_int(pd.sell_amount));
        $('#click_make_amount').html(pretty_int(pd.make_amount));
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
            else if((val)&&((a.required >= 0 && val >= a.required)||(a.required < 0 && val <= a.required))) {
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

    // IRS audit - small; n = % of cash
    function event_irs_audit(n) { 
        var rsk = get_risk2();
        if(rsk < Math.random()) { 
            good_message('You were able to avoid an IRS audit');
            return;
        }
        var amt = pd.cash.amount * n;
        amt -= get_safe_cash();
        if(amt < 1) {
            good_message('The IRS was unable to find any unlaundered cash to seize');
            return;
        }
        pd.cash.amount -= amt;
        bad_message('The IRS has confiscated $'+pretty_bigint(amt)+' of your funds');
    }


    // Meth found, meth per second * r
    function event_found_meth(r) { 
        var amt = pd.stats.clicker_rps * r;
        if(amt < 100) { amt = 100; }
        pd.widgets.amount += amt;
        good_message('You found an extra barrel of meth, with '
            +pretty_bigint(amt)+' batches inside!');
    }

    // Cash found, cash per second * r
    function event_found_cash(r) { 
        var amt = (pd.stats.seller_rps * pd.widget_roi) * r;
        if(amt < 100) { amt = 100; }
        earn_cash(amt);
        if(amt > 10000000000) { 
            good_message('A mystery benefactor has contributed $'
                +pretty_bigint(amt)+' to your cause');
            return;
        }
        if(amt > 10000000) { 
            good_message('You found a truck load of cash, containing $'
                +pretty_bigint(amt)+' inside!');
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
        bad_message('About '+pretty_bigint(amt)+' batches of meth have gone missing...');
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
        bad_message('According to accounting, $'+pretty_bigint(amt)+' has been "lost"');
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
        bad_message('A rival cartel has hijacked a sale worth $'+pretty_bigint(amt)+'!');
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
        bad_message('You had to pay off a government official with $'+pretty_bigint(amt));
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
        bad_message('The DEA has seized $'+pretty_bigint(amt)+'!');
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

function pretty_bigint(num) { 
    var sn = '';
    if(num >= 1000000000000000000000000) { 
        return pretty_int(num)
    }    
    if(num >= 1000000000000000000000) { 
        sn = Math.round((num / 1000000000000000000000) * 100) / 100;
        return sn + 'S';
    }
    if(num >= 1000000000000000000) { 
        sn = Math.round((num / 1000000000000000000) * 100) / 100;
        return sn + 'Qt';
    }
    if(num >= 1000000000000000) { 
        sn = Math.round((num / 1000000000000000)*100) / 100;
        return sn + 'Q';
    }
    if(num >= 1000000000000) { 
        sn = Math.round((num / 1000000000000) * 100) / 100;
        return sn + 'T';
    }
    if(num >= 1000000000) { 
        sn = Math.round((num / 1000000000) * 100) / 100;
        return sn + 'B';
    }
    if(num >= 1000000) { 
        sn = Math.round((num / 1000000) * 100) / 100;
        return sn + 'M';
    } 
    return pretty_int(num);
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

// Analytics
function track_page_view(pg) { 
    if(has_gaq) {
        _gaq.push(['_trackPageview',pg]);
        return true;
    }
    return false;
}

function track_event(category, action, message) {
    return false;
    if(has_gaq) { 
        _gaq.push(['_trackEvent', category, action, message]);
        return true;
    } 
    return false;
}

function log(type, msg, data) { 
    var obj = null;
    if(data) { obj = data; }
    remote_log({
        'type':type,
        'text':msg,
        'version':'{{version}}',
        'user_agent':navigator.userAgent,
        'extra':Base64.encode(JSON.stringify(obj)),
    });
    console.log(type.toUpperCase()+': '+msg);
}

function warning_log(msg, data) { 
    log('warning',msg,data);
}

function debug_log(msg, data) { 
    log('debug',msg,data);
}

function error_log(msg, data) {
    log('error',msg,data);
}

function remote_log(data) {
    if(has_loggly) { 
        _LTracker.push(data);
        return true;
    }
    return false;
}


