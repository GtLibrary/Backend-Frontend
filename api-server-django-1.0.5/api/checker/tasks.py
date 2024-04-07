from celery import shared_task
import openai
import os
from openai import AssistantEventHandler
from typing_extensions import override
import tempfile
import json
import re
import csv
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.core.files import File
from django.conf import settings


chunk_size = 200 * 8            # This is approximately 200 words.
max_chunks = 600                # 120,000 words total

data_dir = "aux-chat-data"

@shared_task
def process_manuscript(manuscript, email):
    # Placeholder for the processing logic
    print(f"Processing manuscript for {email}")

    aux_results = aux_digest_manuscript(manuscript)

    aux_output = aux_summarize_results(aux_results, aux_results + ".csv")

    #aux_output = "/app/code/aux-chat-data/chatfkcfveyg.jsonl.csv.html"

    email_results(aux_output, email)


def email_results(aux_output, email):
    print(f"In email_results {email} gets {aux_output} using {settings.EMAIL_HOST_PASSWORD}")

    # Create email message
    email_message = EmailMessage(
        subject='Manuscript Processing Complete',
        body='Your manuscript has been processed successfully.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[email],
    )

    # Attach the aux_output file
    with open(aux_output, 'rb') as f:
        email_message.attach(filename=aux_output, content=f.read(), mimetype='text/html')  # Adjust mimetype if necessary

    # Send the email
    email_message.send(fail_silently=False)

def parse_completion(completion):
    # Split the completion string into numbers, removing "Reduced Narrative: " and "</s>"
    completion = completion.replace("</s>", "")
    numbers = completion.replace("Reduced Narrative: ", "").split(", ")

    numbers = [int(num) for num in numbers]
    return numbers

def aux_summarize_results(jsonl_filepath, csv_filepath):
    with open(jsonl_filepath, 'r') as jsonl_file, open(csv_filepath, 'w', newline='') as csv_file:
        csv_writer = csv.writer(csv_file)
        # Define the headers based on the metrics we are evaluating
        headers = ["clarity_of_expression", "appropriateness_of_diction", "engagement_and_interest", "use_of_clich", "narrative_flow", "stylistic_elegance", "aesthetic_appeal"]
        # Write the header
        csv_writer.writerow(headers)
        
        for line in jsonl_file:
            data = json.loads(line)
            completion = data.get("completion", "")
            #print(completion)
            # Parse the completion value to extract numbers
            numbers = parse_completion(completion)
            # Write the parsed numbers to the CSV file
            csv_writer.writerow(numbers)
    
    os.system("pwd")
    #os.system("Rscript ./api/checker/aux-summary.Rmd " + csv_filepath)
    
    #os.system("""Rscript -e "rmarkdown::render('./api/checker/aux-summary.Rmd', output_file='specific_output_file.html')""")
    
    # Construct the command string
    command = (
        f"""Rscript -e "rmarkdown::render('./api/checker/aux-summary.Rmd', """
        f"""output_file='{csv_filepath}.html', """
        f"""params=list(aux_babbage_csv_file='{csv_filepath}'))\""""
    )
    print(command)
    os.system(command)

############
# The data handlers fort aux metrics.
############

class EventHandler(AssistantEventHandler):
  #def __init__(self, file_handle):
  #  self.file_handle = file_handle   

  def myinit(self, content, file_handle):
     self.content = content
     self.file_handle = file_handle
     return self 

  @override
  def on_text_created(self, text) -> None:
    #print(f"\nassistant > ", end="", flush=True)
    self.file_handle.write(self.content + "\n---\n")
    #self.file_handle.write("\nassistant > ")
      
  @override
  def on_text_delta(self, delta, snapshot):
    #print(delta.value, end="", flush=True)
    self.file_handle.write(delta.value)

  def on_tool_call_created(self, tool_call):
    #print(f"\nassistant > {tool_call.type}\n", flush=True)
    pass
  
  def on_tool_call_delta(self, delta, snapshot):
    if delta.type == 'code_interpreter':
      if delta.code_interpreter.input:
        #print(delta.code_interpreter.input, end="", flush=True)
        pass
      if delta.code_interpreter.outputs:
        #print(f"\n\noutput >", flush=True)
        pass
        for output in delta.code_interpreter.outputs:
          if output.type == "logs":
            #print(f"\n{output.logs}", flush=True)
            pass


# Ensure the data directory exists

os.makedirs(data_dir, exist_ok=True)

def from_file_digest(digest_file):
    try:
        return digest_file.read(chunk_size);
    except:
        print("File ran out. We are done. Exiting.")

def handle_conversation(i, file_handle, digest_file):
    # Create a Thread
    thread = client.beta.threads.create()
        
    #mock_content = generate_message()
    mock_content = from_file_digest(digest_file)

    print(mock_content)

    # Add a Message to the Thread
    message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=mock_content
    )

    with client.beta.threads.runs.create_and_stream(
            thread_id=thread.id,
            assistant_id=assistant.id,
            #instructions="Start with: Generated Text:",
            event_handler=EventHandler().myinit(mock_content, file_handle),
    ) as stream:
            stream.until_done()


# Predefined categories for each metric
categories = {
    "clarity_of_expression": ["Clear", "Unclear"],
    "appropriateness_of_diction": ["Appropriate", "Inappropriate"],
    "engagement_and_interest": ["Engaging", "Disengaging"],
    "use_of_clich": ["Original", "Clich"],
    "narrative_flow": ["Smooth", "Jarring"],
    "stylistic_elegance": ["Elegant", "Inelegant"],
    "aesthetic_appeal": ["Beautiful", "Mundane"]
}

def find_category_value(line, category_values):
    for value in category_values:
        if value in line:
            return value
    return "Unknown"  # Fallback value if none of the categories match


pattern = re.compile(r": (\d+)\. ")

def aux_digest_manuscript(manuscript):


    jsonl_file_name = ""    ## TO BE SET

    chunk_count = (len(manuscript) + chunk_size - 1) // chunk_size      # Getting that last chunk...
    print("chunk count: " + str(chunk_count))
    chunk_count = min(max_chunks, chunk_count)

    with tempfile.NamedTemporaryFile(mode='w', delete=False, dir=data_dir, prefix="chat", suffix=".txt") as manuscript_file:
        manuscript_file.write(manuscript)   # We write the manuscript out as soon as we start...

        digest_file = open(manuscript_file.name, "r", encoding='utf-8', errors='replace')   # Now reopen manuscript for streaming...

        with tempfile.NamedTemporaryFile(mode='w', delete=False, dir=data_dir, prefix="chat", suffix=".jsonl") as temp_base:
            jsonl_file_name = temp_base.name
            for i in range(chunk_count):
                print(i)
                with open(temp_base.name + "---" + str(i) + ".txt", "w", encoding='utf-8') as temp_file:
                    print(f"Generating conversation {i+1}, writing to: {temp_file.name}")
                    try: 
                        handle_conversation(i, temp_file, digest_file)
                    except Exception as e:
                        print("Prompt failed: " + str(e) + "\nContinuing...")             

                    temp_file_path = temp_file.name

                with open(temp_base.name + "---" + str(i) + ".txt", "r", encoding='utf-8', errors='replace') as temp_file:
                    lines = temp_file.readlines()

                    # Initialize the narrative collection
                    narrative_collected = False
                    generated_narrative = []
                    metrics = {key: "" for key in categories.keys()}

                    for line in lines:
                        if line.strip() == "---":  # Check for the delimiter to stop narrative collection
                            narrative_collected = True
                            continue

                        if not narrative_collected:
                            generated_narrative.append(line.strip())
                        else:
                            for metric, values in categories.items():

                                if metric.replace("_", " ") in line.lower():
                                    
                                    #metrics[metric] = find_category_value(line, values)
                                    #metrics[metric] ~= line.match(/: {\d+}\. /).group(1 or 0, the matching digit(s)) #FIXME Make this code work matching the 3 in: ""...: 3."
                                    match = pattern.search(line)

                                    # Check if we found a match and extract the first group (the digits)
                                    if match:
                                        metrics[metric] = int(match.group(1))  # This extracts the matching digits
                                    else:
                                        metrics[metric] = 5  # Or some default/fallback value

                    #print(file_path + ": " + str(narrative_collected))
                    #print(metrics.values())
                                    
                    if narrative_collected and all(value != "" for value in metrics.values()):
                        metrics_values = ", ".join([f"{value}" for value in metrics.values()])
                        temp_base.write(
                            json.dumps({
                                "prompt": "Reduce Narrative (" + ", ".join([key for key in metrics.keys()]) + "): " + " ".join(generated_narrative) + "</end>",
                                "completion": f"Reduced Narrative: {metrics_values}</s>"
                            }) + "\n"
                        )          
                
                
                print(f"Completed. Responses for conversation {i+1} written to {temp_file_path}.")
    return jsonl_file_name


#############
# FINISH SETTING UP THE OPEANI ASSISTANT
#############

instructions = """
Analysis Criteria:
Clarity of Expression:

Description: "Assess if the narrative's intent and message are easily understandable or if it's marred by ambiguity."
Classification: "Rate on a scale of 1 (very unclear) to 10 (very clear)."
Rationale: "Provide specific examples from the text that contribute to its clarity or lack thereof."
Appropriateness of Diction:

Description: "Evaluate the narrative's word choice for unnecessary complexity or inaccuracy."
Classification: "Rate on a scale of 1 (very inappropriate) to 10 (very appropriate)."
Rationale: "Identify instances where word choice enhances or detracts from the narrative."
Engagement and Interest:

Description: "Determine the narrative's ability to maintain reader interest."
Classification: "Rate on a scale of 1 (very disengaging) to 10 (very engaging)."
Rationale: "Discuss elements that either captivate or alienate the reader."
Use of Clichés:

Description: "Identify reliance on clichés and overused expressions."
Classification: "Rate on a scale of 1 (very clichéd) to 10 (very original)."
Rationale: "Highlight examples of clichéd language and its impact on the narrative."
Narrative Flow:

Description: "Evaluate the smoothness and rhythm of the narrative's progression."
Classification: "Rate on a scale of 1 (very jarring) to 10 (very smooth)."
Rationale: "Analyze the narrative's construction for flow disruptions."
Stylistic Elegance:

Description: "Consider the narrative's stylistic choices and their impact on the reading experience."
Classification: "Rate on a scale of 1 (very inelegant) to 10 (very elegant)."
Rationale: "Reflect on the narrative's style and its contribution to or detriment from the overall appeal."
Aesthetic Appeal:

Description: "Assess the narrative's overall beauty and pleasure in reading."
Classification: "Rate on a scale of 1 (very mundane) to 10 (very beautiful)."
Rationale: "Determine if the narrative offers a reading experience that transcends functionality."
Conclusion:

Instructions: >
Summarize the provided narrative segment based on the above criteria, providing a numerical classification and rationale for each. This comprehensive evaluation should offer insights into the narrative's effectiveness and areas for improvement, focusing on identifying and understanding its writing qualities.
Example:

Instructions: >
Always include the newly generated narrative, and all seven (7) breakdowns in your response, using the 1-10 scale for evaluation.
Example 1: Analysis of a Hypothetical Fantasy Narrative
- Clarity of Expression: 8. The narrative's intent and overarching themes are articulated through vivid descriptions and engaging dialogue, making it relatively easy for the reader to follow. Minor ambiguities in some subplots slightly detract from the overall clarity.
- Appropriateness of Diction: 7. The narrative employs a rich vocabulary that aligns well with its fantasy setting. However, occasional use of contemporary slang breaks the story's medieval atmosphere, slightly undermining the diction's appropriateness.
- Engagement and Interest: 9. With its intricate plot and dynamic characters, the story consistently maintains the reader's interest. The narrative's pacing and suspenseful moments are particularly effective in captivating the audience.
- Use of Clichés: 6. While the narrative introduces several innovative concepts, it sometimes falls back on familiar fantasy tropes, such as the "chosen one" narrative, which detracts from its originality.
- Narrative Flow: 8. The story unfolds in a cohesive manner, with well-structured chapters that guide the reader through the fictional world. Some abrupt scene transitions, however, occasionally disrupt the narrative flow.
- Stylistic Elegance: 7. The narrative's prose is generally polished, employing descriptive imagery and a tone that matches its genre. However, the story's elegance is occasionally marred by overly complex sentences that can be challenging to decipher.
- Aesthetic Appeal: 9. The narrative's vivid imagery and detailed world-building contribute to a beautiful and immersive reading experience that transcends mere functionality, inviting readers to lose themselves in the story's universe.
Example 2: Analysis of a Contemporary Romance Novel
- Clarity of Expression: 9. The narrative's themes of love, loss, and redemption are conveyed with clear and compelling prose, making the story's message accessible and impactful to the reader.
- Appropriateness of Diction: 10. The narrative's language is perfectly suited to its contemporary setting, with dialogue and descriptions that feel authentic and resonate with the reader's real-world experiences.
- Engagement and Interest: 8. The relationship dynamics and emotional depth of the characters engage the reader, though some predictable plot points slightly reduce the overall engagement.
- Use of Clichés: 5. The narrative occasionally relies on clichéd romantic scenarios and resolutions, which, while comforting, also render the story somewhat predictable and diminish its originality.
- Narrative Flow: 9. The novel's pacing is expertly managed, balancing moments of tension and tranquility to create a smooth and engaging reading experience.
- Stylistic Elegance: 8. The writing style is eloquent and expressive, capturing the nuances of romance and emotional turmoil. However, it sometimes verges on being overly sentimental, which can detract from the narrative's stylistic elegance.
- Aesthetic Appeal: 8. The narrative offers a pleasing and evocative reading experience, with descriptive passages that beautifully evoke the settings and emotions central to the story, despite occasional lapses into sentimentality.
"""

# Setup OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')
print("OPEN:" + openai.api_key)
# Ensure the API key is available
if openai.api_key is None:
    raise ValueError("OpenAI API key not found in environment variables")

client = openai.OpenAI()

# Create an Assistant
assistant = client.beta.assistants.create(
    name="Data Generator Django",
    instructions=instructions,
    tools=[],
    model="gpt-3.5-turbo",
)
