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
    imgSrc:"..."
}
const rainbow_walls = {
    id:"rainbow_walls", 
    name: "Rainbow Walls",
    type: "wallpaper", 
    imgSrc:"..."
}

const default_floors = {
    id:"default_floors", 
    name: "Default Floors",
    type: "flooring", 
    imgSrc:"..."
}
const rainbow_floors = {
    id:"rainbow_floors", 
    name: "Rainbow Floors",
    type: "flooring", 
    imgSrc: require("./images/room_items/icon.png")
}

export const shopList = [
    {owned: false, cost: 200, item: default_walls},
    {owned: false, cost: 300, item: default_floors},
    {owned: false, cost: 300, item: rainbow_floors},
    {owned: false, cost: 300, item: rainbow_walls},
]