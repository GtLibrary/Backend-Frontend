import os
from chatapi import ChatAPI

# Set your OpenAI API key here for local testing. Replace 'your_real_api_key' with your actual key.
# IMPORTANT: In a production environment, ensure this key is securely managed.
#os.environ['OPENAI_API_KEY'] = 'your_real_api_key'

def main():
    # Set up the assistant name and instructions according to your assistant's needs.
    assistant_name = "ExampleAssistant"
    instructions = "Please provide concise and relevant answers to the user's questions. Be sure to play along with whatever they are assuming."

    # Initialize the ChatAPI
    chat_api = ChatAPI(assistant_name, instructions)

    # For the purpose of this example, we will use a static string as the content.
    # In a live scenario, this could come from user input, a database, etc.
    example_content = "Hello, can you give me a rundown?"

    # Normally, you would use a file or another form of output storage here.
    # We'll use a simple file handle that writes to 'output.txt'.
    
    chat_api.chat(example_content, "output.txt")

    print("Chat completed and output written to 'output.txt'.")

if __name__ == "__main__":
    main()
