const roomItem = {
    id:"default_walls", // unique name/id that identifies the object
    name: "Default Walls", //The display name of the item
    type: "wallpaper", // The type (wallpaper, flooring, etc.) that the object is
    imgSrc:"..." //path to the image file
};

const default_walls = {
    id:"default_walls", 
    name: "Default Walls",
    type: "wallpaper", 
    imgSrc: require("./images/room_items/gray_walls.png")
}
const blue_walls = {
    id:"blue_walls", 
    name: "Blue Walls",
    type: "wallpaper", 
    imgSrc: require("./images/room_items/blue_walls.png")
}

const wood_floors = {
    id:"default_floors", 
    name: "Default Floors",
    type: "flooring", 
    imgSrc: require("./images/room_items/wood_floor.png")
}
const rainbow_floors = {
    id:"rainbow_floors", 
    name: "Rainbow Floors",
    type: "flooring", 
    imgSrc: require("./images/room_items/rainbow_floor.png")
}

export const shopList = [
    {owned: false, cost: 2, item: default_walls},
    {owned: false, cost: 2, item: wood_floors},
    {owned: false, cost: 5, item: rainbow_floors},
    {owned: false, cost: 5, item: blue_walls},
]