import requests, sys, string
from random import randint

def post_passage(title, text, current_data):
	headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
	data = {'id': len(current_data)+1, 'title': title, 'text': text, 'mastered': 0, 'current passage': 0, 'reviewed':0}
	requests.post("http://localhost:3000/passages", json=data, headers=headers)

def print_passages(current_data):
	for passage in current_data:
		print passage['title']
		print passage['text']
		print "\n"

def add_passage(current_data):
	print "Please enter the TITLE of your passage (Ex: John 3:16)"
	title = raw_input("add >>>")
	print "Please enter the TEXT of your passage"
	text = raw_input("add >>>")
	print "Adding your passage..."
	post_passage(title, text, current_data)
	print "Passage added!"
	return requests.get('http://localhost:3000/passages').json()

def settings(current_data):
	for passage in current_data:
		if passage['current passage'] is 1:
			print "Current passage: " + passage['title']
			change = {"current passage": 0}
			requests.patch('http://localhost:3000/passages/'+str(passage['id']), change)

	print "Please enter the title of the passage you'd like to set as your current passage."
	title = raw_input("settings >>>")
	for passage in current_data:
		if passage['title'] == title:
			identifier = passage['id']
			break
	try:
		identifier
	except UnboundLocalError:
		print "Error: passage not found!"
		return
	change = {"current passage": 1}
	requests.patch('http://localhost:3000/passages/'+str(identifier), change)
	print "Settings saved"
	return requests.get('http://localhost:3000/passages').json()

def get_current_passage(current_data):
	for passage in current_data:
		if passage['current passage'] == 1:
			current_passage=passage
	try:
		print "Your current passage is " + current_passage['title']
	except UnboundLocalError:
		print "Error: no passage set to memorize.  Redirecting to settings..."
		settings(current_data)
		return
	return current_passage

def game(current_data, current_passage):
	passage = current_passage['text'].split(" ")	#Convert the passage to a list of words
	for i in range(1, 10):
		index = randint(1, len(passage)-2)	#Generate a random index
		for word in passage[:index]:
			sys.stdout.write(word + " ")	#Print the words up to the index in the passage
		sys.stdout.write("\n")
		guess = raw_input("What's the next word? >>>")
		correct_answer = str(passage[index]).translate(string.maketrans("",""), string.punctuation) #Ignore Punctuation
		if guess == correct_answer:
			print "Correct!"
		else:
			print "Nope, it's actually " + passage[index] + "."
	print "Great job!"

def review(current_data):
	min_reviewed = 0
	needs_reviewing = None
	for passage in current_data:
		times_reviewed = passage['reviewed']
		if times_reviewed <= min_reviewed:
			min_reviewed = times_reviewed
			needs_reviewing = passage

	if needs_reviewing is None: print "Error!"
	game(current_data, needs_reviewing)
	change = {"reviewed": min_reviewed+1}
	requests.patch('http://localhost:3000/passages/'+str(needs_reviewing['id']), change)



def print_commands():
	print "Type 'passages' to get a list of passages"
	print "Type 'add' to add a passage"
	print "Type 'game' to play a memorization game"
	print "Type 'review' to review a passage"
	print "Type 'settings' to set your current passage"
	print "Type 'commands' to see the list of commands"


print "Welcome to PassageMaster version 0.1a"
print "Will you be the next passage MASTER?"
print "========================================="
print_commands()

data = requests.get('http://localhost:3000/passages').json()
while True:
	command = raw_input('>>>')
	if command == "passages":
		print_passages(data)
	elif command == "add":
		data = add_passage(data)
	elif command == "settings":
		data = settings(data)
	elif command == "game":
		game(data, get_current_passage(data))
	elif command == "review":
		review(data)
	elif command == "commands":
		print_commands()
