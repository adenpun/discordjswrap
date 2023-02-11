let intents = 0;

for (let i = 0; i <= 21; i++) {
    if (i <= 16 || i >= 20) intents += 1 << i;
}

export default intents;
