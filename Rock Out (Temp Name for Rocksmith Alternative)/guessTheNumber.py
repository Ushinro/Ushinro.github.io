import random

guessesTaken = 0
maxGuesses = 6
minNum = 1
maxNum = 20

print("Hello! What is your name?")
myName = input()

number = random.randint(minNum, maxNum)

print("Well, " + myName + ", I am thinking of a number between " + str(minNum) + " and " + str(maxNum))

while guessesTaken < maxGuesses:
    print("Take a guess.")
    guess = input()
    guess = int(guess)

    guessesTaken += 1

    if guess < number:
        print("Your guess is too low.")

    if guess > number:
        print("Your guess is too high.")

    if guess == number:
        break

if guess == number:
    guessesTaken = str(guessesTaken)
    print("Good job, " + myName + "! You guess my number in " + guessesTaken + " guesses!")

if guess != number:
    number = str(number)
    print("Nope. The number I was thinking of was " + number)
