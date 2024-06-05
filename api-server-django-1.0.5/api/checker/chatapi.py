import os
import openai
from openai import AssistantEventHandler
from typing_extensions import override


class EventHandler(AssistantEventHandler):
    def __init__(self, content, file_handle):  # self, content, file_handle):
        super().__init__()
        self.file_handle = file_handle
        self.content = content
        pass

    @override
    def on_text_created(self, text) -> None:
        # print(f"\nassistant > ", end="", flush=True)
        # self.file_handle.write(self.content + "\n---\n")
        # self.file_handle.write("\nassistant > ")
        pass

    @override
    def on_text_delta(self, delta, snapshot):
        # print(delta.value, end="", flush=True)
        self.file_handle.write(delta.value)

    def on_tool_call_created(self, tool_call):
        # print(f"\nassistant > {tool_call.type}\n", flush=True)
        pass

    def on_tool_call_delta(self, delta, snapshot):
        if delta.type == 'code_interpreter':
            if delta.code_interpreter.input:
                # print(delta.code_interpreter.input, end="", flush=True)
                pass
            if delta.code_interpreter.outputs:
                # print(f"\n\noutput >", flush=True)
                pass
                for output in delta.code_interpreter.outputs:
                    if output.type == "logs":
                        # print(f"\n{output.logs}", flush=True)
                        pass


class ChatAPI():
    def __init__(self, assistant_name, instructions, openai_api_key=os.getenv('OPENAI_API_KEY')):
        self.instructions = instructions

        # Setup OpenAI client
        openai.api_key = openai_api_key     #os.getenv('OPENAI_API_KEY')
        print("OPEN:" + openai.api_key)
        # Ensure the API key is available
        if openai.api_key is None:
            raise ValueError(
                "OpenAI API key not found in environment variables")

        self.client = openai.OpenAI()

        # Create an Assistant
        self.assistant = self.client.beta.assistants.create(
            name=assistant_name,
            instructions=self.instructions,
            tools=[],
            model="gpt-4-turbo",
        )

    def chat(self, content, file_name):

        with open(file_name, 'w') as file_handle:

            # Create a Thread
            thread = self.client.beta.threads.create()

            print(content)

            # Add a Message to the Thread
            message = self.client.beta.threads.messages.create(
                thread_id=thread.id,
                role="user",
                content=content
            )

            with self.client.beta.threads.runs.create_and_stream(
                    thread_id=thread.id,
                    assistant_id=self.assistant.id,
                    # instructions="Start with: Generated Text:",
                    event_handler=EventHandler(content, file_handle),
            ) as stream:
                stream.until_done()
