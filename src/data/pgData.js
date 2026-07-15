export const pgData = [
  {
    id: 1,
    name: "Sunrise PG",
    location: "Marathahalli",
    gender: "Male",
    rent: 8500,
    rating: 4.8,
    distance: "0.8 km",
    amenities: ["WiFi", "Lift", "Generator", "Food", "Gym", "Laundry"],
    totalFloors: 5,
    floorAvailability: { "1": 0, "2": 4, "3": 2, "4": 1, "5": 0 },
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
    reviews: [
      { id: 1, author: "Rahul M.", rating: 5, text: "Amazing PG! Super clean and the staff is very helpful. WiFi is blazing fast.", date: "2 weeks ago", avatar: "RM" },
      { id: 2, author: "Kiran S.", rating: 4, text: "Good food, quiet environment. Perfect for working professionals.", date: "1 month ago", avatar: "KS" },
    ]
  },
  {
    id: 2,
    name: "Green Valley PG",
    location: "Marathahalli",
    gender: "Female",
    rent: 9000,
    rating: 4.6,
    distance: "1.2 km",
    amenities: ["WiFi", "Food", "Laundry", "CCTV", "Hot Water"],
    totalFloors: 4,
    floorAvailability: { "1": 1, "2": 0, "3": 3, "4": 2 },
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    reviews: [
      { id: 1, author: "Priya L.", rating: 5, text: "Best PG for women in Marathahalli. Very safe and comfortable.", date: "3 days ago", avatar: "PL" },
      { id: 2, author: "Sneha R.", rating: 4, text: "Great food and friendly atmosphere. Highly recommend!", date: "2 weeks ago", avatar: "SR" },
    ]
  },
  {
    id: 3,
    name: "Urban Nest PG",
    location: "Marathahalli",
    gender: "Male",
    rent: 7500,
    rating: 4.3,
    distance: "0.5 km",
    amenities: ["WiFi", "Generator", "Parking", "Gym"],
    totalFloors: 3,
    floorAvailability: { "1": 2, "2": 1, "3": 3 },
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    reviews: [
      { id: 1, author: "Arjun K.", rating: 4, text: "Good location, close to the tech park. Gym is excellent.", date: "1 week ago", avatar: "AK" },
    ]
  },
  {
    id: 4,
    name: "Comfort Zone PG",
    location: "Marathahalli",
    gender: "Female",
    rent: 10500,
    rating: 4.9,
    distance: "1.5 km",
    amenities: ["WiFi", "Lift", "Food", "Hot Water", "Laundry", "CCTV", "AC"],
    totalFloors: 6,
    floorAvailability: { "1": 0, "2": 0, "3": 1, "4": 2, "5": 1, "6": 3 },
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80",
    reviews: [
      { id: 1, author: "Meera V.", rating: 5, text: "Premium PG with top-notch facilities. Worth every rupee!", date: "5 days ago", avatar: "MV" },
      { id: 2, author: "Anita J.", rating: 5, text: "The AC rooms are amazing! Staff is very cooperative.", date: "3 weeks ago", avatar: "AJ" },
    ]
  },
  {
    id: 5,
    name: "The Hub PG",
    location: "Marathahalli",
    gender: "Co-Live",
    rent: 8000,
    rating: 4.5,
    distance: "2.0 km",
    amenities: ["WiFi", "Gym", "Food", "Laundry", "Generator"],
    totalFloors: 4,
    floorAvailability: { "1": 3, "2": 2, "3": 0, "4": 1 },
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    reviews: [
      { id: 1, author: "Dev P.", rating: 5, text: "Coed PG done right. Great community vibe and awesome facilities.", date: "1 month ago", avatar: "DP" },
    ]
  },
  {
    id: 6,
    name: "Serenity Homes",
    location: "Marathahalli",
    gender: "Male",
    rent: 11000,
    rating: 4.7,
    distance: "0.3 km",
    amenities: ["WiFi", "AC", "Lift", "Food", "Gym", "CCTV", "Parking"],
    totalFloors: 7,
    floorAvailability: { "1": 0, "2": 1, "3": 0, "4": 2, "5": 0, "6": 1, "7": 2 },
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
    reviews: [
      { id: 1, author: "Vikram N.", rating: 5, text: "Closest PG to Bagmane Tech Park. Excellent amenities and peaceful environment.", date: "2 days ago", avatar: "VN" },
    ]
  },
  {
    id: 7,
    name: "Budget Stay PG",
    location: "Marathahalli",
    gender: "Male",
    rent: 4500,
    rating: 3.8,
    distance: "2.5 km",
    amenities: ["WiFi", "Food", "Hot Water"],
    totalFloors: 3,
    floorAvailability: { "1": 2, "2": 5, "3": 3 },
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
    reviews: [
      { id: 1, author: "Rahul T.", rating: 4, text: "Very affordable. Decent food for the price.", date: "1 week ago", avatar: "RT" }
    ]
  },
  {
    id: 8,
    name: "Economy Girls PG",
    location: "Marathahalli",
    gender: "Female",
    rent: 5000,
    rating: 4.0,
    distance: "1.8 km",
    amenities: ["WiFi", "CCTV", "Hot Water", "Laundry"],
    totalFloors: 4,
    floorAvailability: { "1": 1, "2": 0, "3": 4, "4": 2 },
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    reviews: [
      { id: 1, author: "Sneha G.", rating: 4, text: "Good value for money. Safe area.", date: "2 months ago", avatar: "SG" }
    ]
  },
  {
    id: 9,
    name: "Cozy Living PG",
    location: "Marathahalli",
    gender: "Female",
    rent: 5500,
    rating: 4.1,
    distance: "1.2 km",
    amenities: ["WiFi", "Food", "CCTV", "Hot Water"],
    totalFloors: 3,
    floorAvailability: { "1": 1, "2": 2, "3": 0 },
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&q=80",
    reviews: [
      { id: 1, author: "Pooja M.", rating: 4, text: "Quiet and safe place.", date: "3 weeks ago", avatar: "PM" }
    ]
  },
  {
    id: 10,
    name: "Student Haven",
    location: "Marathahalli",
    gender: "Male",
    rent: 5800,
    rating: 3.9,
    distance: "2.1 km",
    amenities: ["WiFi", "Laundry", "Hot Water"],
    totalFloors: 4,
    floorAvailability: { "1": 3, "2": 1, "3": 1, "4": 0 },
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
    reviews: [
      { id: 1, author: "Amit S.", rating: 4, text: "Good for students, close to bus stop.", date: "1 month ago", avatar: "AS" }
    ]
  },
  {
    id: 11,
    name: "Harmony Co-Live",
    location: "Marathahalli",
    gender: "Co-Live",
    rent: 6200,
    rating: 4.2,
    distance: "1.5 km",
    amenities: ["WiFi", "Food", "Gym", "CCTV"],
    totalFloors: 5,
    floorAvailability: { "1": 0, "2": 0, "3": 2, "4": 4, "5": 1 },
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
    reviews: [
      { id: 1, author: "Neha K.", rating: 5, text: "Great community events and good food.", date: "2 days ago", avatar: "NK" }
    ]
  },
  {
    id: 12,
    name: "Silver Oak PG",
    location: "Marathahalli",
    gender: "Male",
    rent: 6800,
    rating: 4.3,
    distance: "0.9 km",
    amenities: ["WiFi", "Food", "Lift", "Generator"],
    totalFloors: 4,
    floorAvailability: { "1": 1, "2": 1, "3": 0, "4": 2 },
    image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80",
    reviews: [
      { id: 1, author: "Ravi J.", rating: 4, text: "Power backup is a lifesaver.", date: "5 days ago", avatar: "RJ" }
    ]
  },
  {
    id: 13,
    name: "Elite Executive PG",
    location: "Marathahalli",
    gender: "Female",
    rent: 9500,
    rating: 4.8,
    distance: "0.6 km",
    amenities: ["WiFi", "AC", "Lift", "Food", "Gym", "CCTV"],
    totalFloors: 6,
    floorAvailability: { "1": 0, "2": 0, "3": 1, "4": 1, "5": 0, "6": 2 },
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
    reviews: [
      { id: 1, author: "Divya R.", rating: 5, text: "Perfect for working professionals. Very clean.", date: "1 week ago", avatar: "DR" }
    ]
  },
  {
    id: 14,
    name: "Luxury Living Suites",
    location: "Marathahalli",
    gender: "Co-Live",
    rent: 12500,
    rating: 4.9,
    distance: "0.4 km",
    amenities: ["WiFi", "AC", "Lift", "Food", "Gym", "CCTV", "Parking", "Laundry"],
    totalFloors: 7,
    floorAvailability: { "1": 0, "2": 0, "3": 0, "4": 1, "5": 0, "6": 1, "7": 1 },
    image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
    reviews: [
      { id: 1, author: "Sameer V.", rating: 5, text: "Absolutely premium experience. Feels like a hotel.", date: "3 weeks ago", avatar: "SV" }
    ]
  }
];
export const amenityIcons = {
  WiFi: "📶",
  Lift: "🛗",
  Generator: "⚡",
  Food: "🍽️",
  Gym: "💪",
  Laundry: "👕",
  CCTV: "📹",
  "Hot Water": "🚿",
  AC: "❄️",
  Parking: "🅿️",
};
