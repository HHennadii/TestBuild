export const ConfigurableList = {
    "LOKOLOGIS": {
        "Name":"LOKO LOGIS",
        "Image":"./sprites/configurator/LOKOLOGIS/LOKOLOGIS.png",
        "Category":"ParcelSystems",
        "ElementsBorders":{
            "usual": ["Fridge",'Cooling','Ambient','Type1','Type2','Type3','Type4','Type5','Type6'],
            "terminal": ['TerminalPro','TerminalST'],
            "fresh" : ["Fridge",'Cooling','Ambient'],
            "All":["Fridge",'Ambient','Type1','Type2','Type3','Type4','Type5','Type6','TerminalPro','TerminalST']
        },
        "Elements": {
            'Fridge': {
                'itname': 'Freezing',
                'cellemount':'-12...18&#8451<br /> &#8203',
                'name': 'Fridge',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/Fridge.png'
            },
            'Cooling': {
                'itname': 'Cooling',
                'cellemount':'+1..7&#8451<br /> &#8203',
                'name': 'Cooling',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/Fridge.png'
            },
            'Ambient': {
                'itname': 'Ambient',
                'cellemount':'&#8203 <br /> &#8203',
                'name': 'Ambient',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/Fridge.png'
            },
            'Type1': {
                'itname': 'Type 1',
                'cellemount':'12 cells <br /> &#8203',
                'name': 'Column Loko LOGIS D500 for 12 cells',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/Type1.png'
            },
            'Type2': {
                'itname': 'Type 2',
                'cellemount':'12 cells <br /> &#8203',
                'name': 'Column Loko LOGIS D500 for 12 cells',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/Type2.png'
            },
            'Type3': {
                'itname': 'Type 3',
                'cellemount':'11 cells <br /> &#8203',
                'name': 'Column Loko LOGIS D500 for 11 cells',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/Type3.png'
            },
            'Type4': {
                'itname': 'Type 4',
                'cellemount':'10 cells <br /> &#8203',
                'name': 'Column Loko LOGIS D500 for 10 cells',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/Type4.png'
            },
            'Type5': {
                'itname': 'Type 5',
                'cellemount':'7  cells <br /> &#8203',
                'name': 'Column Loko LOGIS D500 for 7 cells',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/Type5.png'
            },
            'Type6': {
                'itname': 'Type 6',
                'cellemount':'4  cells <br /> &#8203',
                'name': 'Column Loko LOGIS D500 for 4 cells',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/Type6.png'
            },
            'TerminalPro': {
                'itname': 'Terminal',
                'cellemount':'PRO <br /> &#8203',
                'name': 'Terminal column PRO Loko LOGIS D500',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/TerminalPro.png'
            },
            'TerminalST': {
                'itname': 'Terminal',
                'cellemount':'Standard <br /> &#8203',
                'name': 'Terminal column Loko LOGIS D500',
                'imageName':'../sprites/configurator/LOKOLOGIS/Preview/TerminalST.png'
            },
        },         
    },
    "LOKOACCESSORIES": {
        "Name":"LOKO LOGIS ACCESSORIES",
        "Image":"./sprites/configurator/LOKOACCESSORIES/ACCESSORIES.png",
        "Category":"ParcelSystems",
        "ElementsBorders":{
            "All":['SetB','SetBP','SetBR','SetBRP','SetP','SetR','SetRP']
        },
        "Elements": {
            'SetB': {
                'itname': 'Accessories',
                'cellemount':`bench <br /> &#8203 `,
                'name': 'Accessories bench',
                'imageName':'../sprites/configurator/LOKOACCESSORIES/Preview/SetB.png'
            },
            'SetR': {
                'itname': 'Accessories',
                'cellemount':`roof <br /> &#8203 `,
                'name': 'Accessories roof',
                'imageName':'../sprites/configurator/LOKOACCESSORIES/Preview/SetR.png'
            },
            'SetP': {
                'itname': 'Accessories',
                'cellemount':`cahpo <br /> &#8203 `,
                'name': 'Accessories cahpo',
                'imageName':'../sprites/configurator/LOKOACCESSORIES/Preview/SetP.png'
            },
            'SetBP': {
                'itname': 'Accessories',
                'cellemount': `bench cahpo <br /> &#8203`,
                'name': 'Accessories bench cahpo',
                'imageName':'../sprites/configurator/LOKOACCESSORIES/Preview/SetBP.png'
            },
            'SetBR': {
                'itname': 'Accessories',
                'cellemount':`bench roof <br /> &#8203`,
                'name': 'Accessories bench roof',
                'imageName':'../sprites/configurator/LOKOACCESSORIES/Preview/SetBR.png'
            },
            'SetRP': {
                'itname': 'Accessories',
                'cellemount':`roof cahpo <br /> &#8203`,
                'name': 'Accessories roof cahpo',
                'imageName':'../sprites/configurator/LOKOACCESSORIES/Preview/SetRP.png'
            },
            'SetBRP': {
                'itname': 'Accessories',
                'cellemount':`bench roof cahpo<br /> &#8203`,
                'name': 'Accessories bench roof cahpo',
                'imageName':'../sprites/configurator/LOKOACCESSORIES/Preview/SetBRP.png'
            },
        },
    },
    "LOKOFRESH": {
        "Name":"LOKO FRESH",
        "Image":"./sprites/configurator/LOKOFRESH/LOKOFRESH.png",
        "Category":"ParcelSystems",
        "ElementsBorders":{
            "usual": ['Cooling','Ambient','Freezing'],
            "terminal": ['TerminalCooling','TerminalAmbient'],
            "All":['Cooling','Ambient','Freezing','TerminalCooling','TerminalAmbient']
        },
        "Elements": {
            'TerminalCooling': {
                'itname': 'Terminal cooling',
                'cellemount':'+1..7&#8451<br /> &#8203 ',
                'name': 'Terminal cooling column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/LOKOFRESH/Preview/TerminalCooling.png'
            },
            'TerminalAmbient': {
                'itname': 'Terminal ambient',
                'cellemount': '&#8203<br /> &#8203',
                'name': 'Terminal ambient column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/LOKOFRESH/Preview/TerminalAmbient.png'
            },
            'Cooling': {
                'itname': 'Cooling',
                'cellemount':'+1..7&#8451<br /> &#8203',
                'name': 'Cooling column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/LOKOFRESH/Preview/Type1.png'
            },
            'Ambient': {
                'itname': 'Ambient',
                'cellemount':'&#8203<br /> &#8203',
                'name': 'Ambient column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/LOKOFRESH/Preview/Type2.png'
            },
            'Freezing': {
                'itname': 'Freezing',
                'cellemount':'-12...18&#8451<br /> &#8203',
                'name': 'Freezing column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/LOKOFRESH/Preview/Type3.png'
            },
        },
    },
    "ECOLOGIS": {
        "Name":"ECO LOGIS",
        "Image":"./sprites/configurator/ECOLOGIS/ECOLOGIS.png",
        "Category":"ParcelSystems",
        "Category":"ParcelSystems",
        "ElementsBorders":{
            "usual": ['Type1','Type2','Type3','Type4','Type5','Type6'],
            "All":['Type1','Type2','Type3','Type4','Type5','Type6']
        },
        "Elements": {
            'Type1': {
                'itname': 'Type 1',
                'cellemount':'12 cells',
                'name': 'Column Loko LOGIS D500 for 12 cells',
                'imageName':'../sprites/configurator/ECOLOGIS/Preview/Type1.png'
            },
            'Type2': {
                'itname': 'Type 2',
                'cellemount':'12 cells',
                'name': 'Column Loko LOGIS D500 for 12 cells',
                'imageName':'../sprites/configurator/ECOLOGIS/Preview/Type2.png'
            },
            'Type3': {
                'itname': 'Type 3',
                'cellemount':'11 cells',
                'name': 'Column Loko LOGIS D500 for 11 cells',
                'imageName':'../sprites/configurator/ECOLOGIS/Preview/Type3.png'
            },
            'Type4': {
                'itname': 'Type 4',
                'cellemount':'10 cells',
                'name': 'Column Loko LOGIS D500 for 10 cells',
                'imageName':'../sprites/configurator/ECOLOGIS/Preview/Type4.png'
            },
            'Type5': {
                'itname': 'Type 5',
                'cellemount':'7  cells',
                'name': 'Column Loko LOGIS D500 for 7 cells',
                'imageName':'../sprites/configurator/ECOLOGIS/Preview/Type5.png'
            },
            'Type6': {
                'itname': 'Type 6',
                'cellemount':'4  cells',
                'name': 'Column Loko LOGIS D500 for 4 cells',
                'imageName':'../sprites/configurator/ECOLOGIS/Preview/Type6.png'
            },
        },
    },
    
    "SHELF": {
        "Name":"Wall shelf",
        "Image":"./sprites/configurator/SHELF/SHELF.png",
        "Category":"Convinian",
        "ElementsBorders":{
            "usual": ['Type1','Type2','Type3','Type4','Type5','Type6','Type7'],
            "All":['Type1','Type2','Type3','Type4','Type5','Type6','Type7']
        },
        "Elements": {
            'Type1': {
                'itname': 'Standart',
                'cellemount':'Shelf<br>Shelves',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/Type1.png'
            },
            'Type2': {
                'itname': 'Hooks',
                'cellemount':'Shelf<br>Shelves',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/Type2.png'
            },
            'Type3': {
                'itname': 'Tree',
                'cellemount':'Shelf<br>Shelves',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/Type3.png'
            },
            'Type4': {
                'itname': 'Streng.',
                'cellemount':'Shelf<br>Shelves',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/Type4.png'
            },
            'Type5': {
                'itname': 'Bread',
                'cellemount':'Shelf<br>Shelves',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/Type5.png'
            },
            'Type6': {
                'itname': 'Cereals',
                'cellemount':'Shelf<br>Shelves',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/Type6.png'
            },
            'Type7': {
                'itname': 'For boxes',
                'cellemount':'Shelf<br>Shelves',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/Type7.png'
            },
        },
    },


    "DOUBLESHELF": {
        "Name":"Double shelf",
        "Image":"./sprites/configurator/SHELF/DOUBLESHELF.png",
        "Category":"Convinian",
        "ElementsBorders":{
            "usual": ['Type1','Type2','Type3','Type4','Type5','Type6','Type7'],
            "All":['Type1','Type2','Type3','Type4','Type5','Type6','Type7']
        },
        "Elements": {
            'Type1': {
                'itname': 'Standart<br>Shelf',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/DoublesideType1.png'
            },
            'Type2': {
                'itname': 'Hooks<br>Shelf',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/DoublesideType2.png'
            },
            'Type3': {
                'itname': 'Tree<br>Shelf',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/DoublesideType3.png'
            },
            'Type4': {
                'itname': 'Streng.<br>Shelf',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/DoublesideType4.png'
            },
            'Type5': {
                'itname': 'Bread<br>Shelf',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/DoublesideType5.png'
            },
            'Type6': {
                'itname': 'Cereals<br>Shelf',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/DoublesideType6.png'
            },
            'Type7': {
                'itname': 'For boxes<br>Shelf',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/SHELF/Preview/DoublesideType7.png'
            },
        },
    },

    "CHECKOUT": {
        "Name":"CHECK OUT",
        "Image":"./sprites/configurator/CHECKOUT/CHECKOUT.png",
        "Category":"Convinian",
        "ElementsBorders":{
            "usual": ['Grid','GridSO','Shelf','ShelfSO','ShelfLarge'],
            "All":['Grid','GridSO','Shelf','ShelfSO','ShelfLarge']
        },
        "Elements": {
            'Grid': {
                'itname': 'Grid',
                'cellemount':'&#8203<br /> &#8203',
                'name': 'Terminal cooling column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/CHECKOUT/Preview/Grid.png'
            },
            'GridSO': {
                'itname': 'GridSO',
                'cellemount': '&#8203<br /> &#8203',
                'name': 'Terminal ambient column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/CHECKOUT/Preview/GridSO.png'
            },
            'Shelf': {
                'itname': 'Shelf',
                'cellemount':'&#8203<br /> &#8203',
                'name': 'Cooling column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/CHECKOUT/Preview/Shelf.png'
            },
            'ShelfSO': {
                'itname': 'ShelfSO',
                'cellemount':'&#8203<br /> &#8203',
                'name': 'Ambient column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/CHECKOUT/Preview/ShelfSO.png'
            },
            'ShelfLarge': {
                'itname': 'ShelfLarge',
                'cellemount':'&#8203<br /> &#8203',
                'name': 'Freezing column Loko FRESH D700 for 4 cells',
                'imageName':'../sprites/configurator/CHECKOUT/Preview/ShelfLarge.png'
            },
        },
    },

    "FRIDGE": {
        "Name":"COOLES SlimDeck",
        "Image":"./sprites/configurator/FRIDGE/FRIDGE.png",
        "Category":"Convinian",
        "ElementsBorders":{
            "fresh" : ["freeze"],
            "usual": ['standart'/*,'pro'*/,'freeze'],
            "All":['standart'/*,'pro'*/,'freeze']
        },
        "Elements": {
            'standart': {
                'itname': 'Cooling<br>deck',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/FRIDGE/Preview/standart.png'
            },
           /* 'pro': {
                'itname': 'PRO',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/FRIDGE/Preview/Pro.png'
            }, */
            'freeze': {
                'itname': 'Freezing<br>deck',
                'name': 'Shelf Stack',
                'imageName':'../sprites/configurator/FRIDGE/Preview/freze.png'
            },
        },
    },
}

export const OrdinaryObjects = {
    "LOKOLOCAL": {
        "art":"xxx1-x20-xx1",
        "Name":"LOKO LOCAL",
        "Image":"./sprites/ordinary/MenuPreview/LokoLocal.png",
        "Category":"ParcelSystems",
        "price":"900",
    },
    "LOKOCOMMON": {
        "art":"xxx2-x20-xx2",
        "Name":"LOKO COMMON",
        "Image":"./sprites/ordinary/MenuPreview/LokoCommon.png",
        "Category":"ParcelSystems",
        "price":"1280",
    },
    "GREORA": {
        "art":"xxx2-x20-xx3",
        "Name":"GREORA",
        "Image":"./sprites/ordinary/MenuPreview/Greora.png",
        "Category":"Convinian",
        "price":"1280",
    },
    "Coffeemodule": {
        "art":"xxx2-x20-xx3",
        "Name":"Coffee module",
        "Image":"./sprites/ordinary/MenuPreview/Coffee module.png",
        "Category":"Convinian",
        "price":"2280",
    },
    "Backwall": {
        "art":"xxx2-x20-xx3",
        "Name":"Backwall",
        "Image":"./sprites/ordinary/MenuPreview/Backwall.png",
        "Category":"Convinian",
        "price":"2080",
    },
    "Luna": {
        "art":"xxx2-x20-xx3",
        "Name":"Luna",
        "Image":"./sprites/ordinary/MenuPreview/Luna.png",
        "Category":"Convinian",
        "price":"2080",
    },
    "Lyra": {
        "art":"xxx2-x20-xx3",
        "Name":"Lyra",
        "Image":"./sprites/ordinary/MenuPreview/Lyra.png",
        "Category":"Convinian",
        "price":"2080",
    },
    "sunermini": {
        "art":"xxx2-x20-xx3",
        "Name":"Suner mini",
        "Image":"./sprites/ordinary/MenuPreview/suner mini.png",
        "Category":"Convinian",
        "price":"2080",
    },
    /*"PPP": {
        "art":"xxxx-xxx-xxx",
        "Name":"SPECIAL OFFER",
        "Image":"./sprites/ordinary/MenuPreview/Ppp.png",
        "Category":"ParcelSystems",
        "price":"100000000",
    },*/
}


export const Category = {
    "Convinian" :{
        "Name": "Convenience store" 
    },
    "ParcelSystems" :{
        "Name": "Parcel Systems" 
    },
}
