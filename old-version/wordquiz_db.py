import sqlite3
from xml.dom.minidom import Document, Element

con= sqlite3.connect('wordquiz1.db')
cur=con.cursor()
cur.execute("CREATE TABLE IF NOT EXISTS wordquiz1(name text, wordquiz1 text);")

btn_save_quiz_data = Element("btn_save_quiz_data")
input_user_name=Element("input_user_name")
save_data_cat1=Element("save_data_cat1")
save_data_cat2=Element("save_data_cat2")
quiz_data_inputBox=Element("textArea")

# imsiText=Element("imsitext")

# btn_save_quiz_data.addEventListener('click')

def collectData():
	quizText=quiz_data_inputBox.value
	userName=input_user_name.value
	cat1=save_data_cat1.value
	cat2=save_data_cat2.value

	# imsiText.innerText=quizText
	print(quizText)

