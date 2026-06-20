const messages = [
  "💧 Hey! Your cells are thirsty. Drink up!",
  "🌊 Water o'clock! Hydrate yourself.",
  "🥤 One glass of water = one step closer to glowing skin.",
  "💦 Your body is 60% water. Don't let the percentage drop!",
  "🚰 Quick reminder: drink a glass of water RIGHT NOW.",
  "🌿 Nature's best drink is calling your name — water!",
  "⚡ Feeling sluggish? Water is the answer. Always.",
  "🧠 Your brain loves water. Give it some love.",
  "🏃 Athletes hydrate. Champions hydrate more. Be a champion.",
  "🌸 Soft skin, clear mind, great energy — all from water!",
  "🫧 Bubble up! Time for a water break.",
  "🌈 Stay colorful, stay hydrated!",
  "🎯 Goal: Drink water. Status: NOW.",
  "🍃 Fresh water, fresh mind. Drink up!",
  "⏰ Hourly check-in: Have you had water yet?",
  "💪 Muscles work better when hydrated. Fill that glass!",
  "🌙 Your future self will thank you for drinking water now.",
  "🔋 Low on energy? Water is your natural battery charger.",
  "😎 Cool people drink water. You're cool, right?",
  "🩺 Doctor's orders: drink more water. (We're not doctors, but still.)",
];

export function getRandomMessage(): { title: string; body: string } {
  const body = messages[Math.floor(Math.random() * messages.length)];
  return { title: '💧 HydroRemind', body };
}
