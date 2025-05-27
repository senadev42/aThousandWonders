export const regionNodeData = [
  {
    id: "daravzeh",
    name: "Daravzeh Port",
    points: [
      [594, 6],
      [588, 148],
      [442, 88],
      [414, 92],
      [408, 170],
      [299, 120], //daravzeh - nardeban south point
      [197, 6], //daravzeh - nardeban north point
      [366, 6],
      [433, 47],
    ],
    color: "#4A90A0",
    highlightColor: "#5FB0C0",
    info: {
      type: "Coastal Gateway",
      resources: "Sea trade, Foreign markets",
      settlements: "Darvazeh",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  },
  {
    id: "nardeban",
    name: "Nardeban Pass",
    points: [
      [4, 104],
      [289, 255],
      [299, 120], //daravzeh - nardeban south point
      [197, 6],
      [5, 6],
      [4, 104], // Close the polygon by repeating first point
    ],
    color: "#8B8B83",
    highlightColor: "#A0A097",
    info: {
      type: "Steppe Pass",
      resources: "Raw stellshade deposits, Mountain springs",
      settlements: "Ohrmahbahn",
      description:
        "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  },
  {
    id: "hezarkuh",
    name: "Hezarkuh Mountains",
    points: [
      [4, 424],
      [115, 419],
      [163, 339],
      [140, 295],
      [289, 255], // Changed from 284 to match Nardeban's 289
      [4, 104], // Matches Nardeban's starting point
    ],
    color: "#8B8B83",
    highlightColor: "#A0A097",
    info: {
      type: "Mountain Range",
      resources: "Raw stellshade deposits, Mountain springs",
      settlements: "Dahreshar",
      description:
        "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    },
  },
  {
    id: "khorProper",
    name: "Khor Proper",
    points: [
      [122, 415],
      [163, 339], // Changed to match Hezarkuh's 163
      [140, 295], // Matches Hezarkuh
      [289, 255], // Matches both neighbors
      [332, 271],
      [319, 348],
      [394, 415],
      [487, 500],
      [281, 547],
      [122, 415], // Close the polygon
    ],
    color: "#DEB887",
    highlightColor: "#F5DEB3",
    info: {
      type: "Central Valley",
      resources: "Refined stellshade, Trade crossroads",
      settlements: "Khancharah, Thurrayah Ribat, Wahapur",
      description:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ",
    },
  },
  {
    name: "Nilujar Reaches",
    points: [
      [587, 558],
      [579, 512],
      [557, 462],
      [549, 359],
      [481, 273],
      [403, 171],
      [299, 120], //nilajar - nardeban - Darvazeh north point
      [291, 254], // Should this match Nardeban's 289?
      [332, 271], // Matches Khor Proper
      [325, 351], // Should match Khor Proper's 319,348?
      [491, 498], // Should this match Khor Proper's 487,500?
      [505, 565],
      [587, 574],
      [587, 558], // Close the polygon
    ],
    color: "#CD853F",
    highlightColor: "#DAA520",
    info: {
      type: "Eastern Territory",
      resources: "Stellshade refineries, Eastern trade",
      settlements: "Nilujar, Marjabad",
      description:
        "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. ",
    },
  },
  {
    name: "Lalelizan Expanse",
    points: [
      [595, 649],
      [587, 575],
      [499, 568],
      [494, 497],
      [280, 550],
      [316, 651],
      [468, 653],
    ],
    color: "#B8860B",
    highlightColor: "#DAA520",
    info: {
      type: "Southern Desert",
      resources: "Raw materials, Desert herbs",
      settlements: "Lalelizan",
      description:
        "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur",
    },
  },
  {
    name: "Setareh Valley",
    points: [
      [4, 424],
      [118, 419],
      [277, 554],
      [313, 653],
      [220, 652],
      [203, 629],
      [164, 619],
      [132, 638],
      [102, 623],
      [74, 565],
      [30, 512],
      [2, 545],
    ],
    color: "teal",
    highlightColor: "#20B2AA",
    info: {
      type: "Protected Valley",
      resources: "Agriculture, Water sources",
      settlements: "Setareh-abad",
      description:
        "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident",
    },
  },
];
