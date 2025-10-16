// Sample texts for testing POS and NER analysis
// Edit these samples as needed for your use cases

export const POS_SAMPLES = [
  {
    id: 'simple',
    title: 'Simple Sentence',
    text: 'The quick brown fox jumps over the lazy dog.'
  },
  {
    id: 'complex',
    title: 'Complex Sentence',
    text: 'Although it was raining heavily, the dedicated students continued their research in the university library, analyzing various linguistic patterns and grammatical structures.'
  },
  {
    id: 'business',
    title: 'Business Text',
    text: 'Our company plans to launch a revolutionary new product next quarter, which will significantly improve customer satisfaction and increase our market share.'
  },
  {
    id: 'academic',
    title: 'Academic Text',
    text: 'The researchers conducted a comprehensive study examining the correlation between social media usage and mental health outcomes among college students.'
  },
  {
    id: 'news',
    title: 'News Article',
    text: 'The government announced new policies yesterday that will affect millions of citizens, including changes to healthcare regulations and tax reforms.'
  }
];

export const NER_SAMPLES = [
  {
    id: 'simple_entities',
    title: 'Simple Entities',
    text: 'Apple Inc. was founded by Steve Jobs in California on April 1, 1976.'
  },
  {
    id: 'complex_entities',
    title: 'Complex Entities',
    text: 'Microsoft Corporation, headquartered in Redmond, Washington, announced a $50 billion acquisition of Activision Blizzard on January 18, 2022.'
  },
  {
    id: 'news_entities',
    title: 'News Entities',
    text: 'The United Nations Security Council met in New York yesterday to discuss the ongoing conflict in Ukraine, with representatives from Russia, China, and the United States attending.'
  },
  {
    id: 'financial_entities',
    title: 'Financial Text',
    text: 'Tesla Inc. reported a 25% increase in revenue to $81.5 billion in 2022, with CEO Elon Musk announcing plans to expand operations in Europe and Asia.'
  },
  {
    id: 'historical_entities',
    title: 'Historical Text',
    text: 'World War II ended on September 2, 1945, when Japan formally surrendered aboard the USS Missouri in Tokyo Bay, marking the conclusion of the deadliest conflict in human history.'
  }
];

export const TRANSLATION_SAMPLES = [
  {
    id: 'greeting',
    title: 'Greeting',
    text: 'Hello, how are you today?'
  },
  {
    id: 'business_meeting',
    title: 'Business Meeting',
    text: 'We need to schedule a meeting to discuss the quarterly results and plan our strategy for the next fiscal year.'
  },
  {
    id: 'travel',
    title: 'Travel',
    text: 'I would like to book a flight from New York to Paris for next week, preferably in business class.'
  },
  {
    id: 'food',
    title: 'Food',
    text: 'This restaurant serves the most delicious pasta I have ever tasted, with fresh ingredients and authentic Italian recipes.'
  },
  {
    id: 'technology',
    title: 'Technology',
    text: 'Artificial intelligence and machine learning are revolutionizing the way we process data and make decisions in modern businesses.'
  }
];
