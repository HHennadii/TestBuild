export function getPostCoef(id)
{
    switch(id)
    {
        case "Cooling": return 0.699;
        case "Ambient": return 0.699;
        case "Fridge": return 0.699;
        case "Type1": return 0.487;
        case "Type2": return 0.487;
        case "Type3": return 0.487;
        case "Type4": return 0.487;
        case "Type5": return 0.487;
        case "Type6": return 0.487;
        case "TerminalPro": return 0.487;
        case "TerminalST": return 0.487;
        case "TerminalSTFR": return 0.487;
        case "Endwall": return 0.0249;
    }
}


export function getColorCode(rgb) {
    switch(rgb[0]+'') {
        case '236': return 'Paper white';
        case '183': return 'Organic grey';
        case '127': return 'Meteorite';
        case '151': return 'Greyhound';
        case '48': return 'Grünewald green';
        case '14': return 'Ultima black';
    }
}