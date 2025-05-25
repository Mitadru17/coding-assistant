/**
 * Mock service that returns hardcoded responses
 * This is a fallback since we're experiencing issues with the Hugging Face API
 */

// Sample coding questions
const sampleQuestions = [
  `Q: Given an array of integers, find two numbers such that they add up to a specific target.
Difficulty: Easy
Tags: Arrays, Hash Table, Two Pointers`,

  `Q: Implement a function to check if a binary tree is balanced.
Difficulty: Medium
Tags: Trees, Depth-First Search, Recursion`,

  `Q: Design and implement an LRU (Least Recently Used) cache.
Difficulty: Hard
Tags: Hash Table, Linked List, Design`
];

// Sample explanations
const sampleExplanations = {
  default: `Here's a step-by-step solution:

1. Understand the problem:
   - We need to find a pair of numbers in an array that sum to a target value.

2. Algorithm approach:
   - Use a hash map to store elements we've seen so far
   - For each element, check if (target - element) exists in the hash map
   - If it does, we found our pair
   - If not, add the current element to the hash map

3. Python Implementation:

\`\`\`python
def two_sum(nums, target):
    # Hash map to store numbers we've seen
    seen = {}
    
    # Loop through each number
    for i, num in enumerate(nums):
        # Calculate the complement we need
        complement = target - num
        
        # If complement exists in our hash map
        if complement in seen:
            # Return the indices of the two numbers
            return [seen[complement], i]
        
        # Store current number and its index
        seen[num] = i
    
    # If no solution is found
    return None
\`\`\`

4. Time Complexity: O(n) - we traverse the array once
5. Space Complexity: O(n) - in the worst case, we store all elements in the hash map

5. Edge cases:
   - Empty array: return None
   - No solution exists: return None
   - Multiple solutions: return the first one found`,

  linkedList: `Here's how to reverse a linked list:

1. Algorithm approach:
   - Use three pointers: prev, current, and next
   - Iterate through the list, reversing each pointer

2. Python Implementation:

\`\`\`python
def reverse_linked_list(head):
    prev = None
    current = head
    
    while current:
        # Save next node
        next_node = current.next
        
        # Reverse the pointer
        current.next = prev
        
        # Move pointers forward
        prev = current
        current = next_node
    
    # New head is the previous tail
    return prev
\`\`\`

3. Time Complexity: O(n)
4. Space Complexity: O(1) - only using a constant amount of extra space`,

  sorting: `Common sorting algorithms:

1. Bubble Sort:
   - Time Complexity: O(n²)
   - Space Complexity: O(1)
   - Simple but inefficient for large lists

2. Merge Sort:
   - Time Complexity: O(n log n)
   - Space Complexity: O(n)
   - Divide and conquer approach, stable sort

3. Quick Sort:
   - Time Complexity: Average O(n log n), Worst O(n²)
   - Space Complexity: O(log n)
   - Usually faster in practice than merge sort

4. Heap Sort:
   - Time Complexity: O(n log n)
   - Space Complexity: O(1)
   - In-place sorting algorithm

5. Insertion Sort:
   - Time Complexity: O(n²)
   - Space Complexity: O(1)
   - Efficient for small data sets`
};

/**
 * Generates a daily coding interview question
 * @returns {Promise<string>} The generated question with difficulty and tags
 */
async function generateDailyQuestion() {
  try {
    // Return a random sample question
    const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
    return sampleQuestions[randomIndex];
  } catch (error) {
    console.error('Error generating daily question:', error);
    return sampleQuestions[0]; // Return the first sample question as fallback
  }
}

/**
 * Generates an explanation for a coding question
 * @param {string} question - The question to explain
 * @returns {Promise<string>} The detailed explanation
 */
async function generateExplanation(question) {
  try {
    // Check the question content to return a relevant explanation
    if (question.toLowerCase().includes('linked list')) {
      return sampleExplanations.linkedList;
    } else if (question.toLowerCase().includes('sort')) {
      return sampleExplanations.sorting;
    } else {
      return sampleExplanations.default;
    }
  } catch (error) {
    console.error('Error generating explanation:', error);
    return sampleExplanations.default; // Return the default explanation as fallback
  }
}

/**
 * Handles general chatbot interactions
 * @param {string} userMessage - The user's message to the chatbot
 * @returns {Promise<string>} The chatbot's response
 */
async function chatWithBot(userMessage) {
  try {
    // Check the message content to return a relevant response
    if (userMessage.toLowerCase().includes('linked list')) {
      return sampleExplanations.linkedList;
    } else if (userMessage.toLowerCase().includes('sort')) {
      return sampleExplanations.sorting;
    } else {
      return `I'm a coding assistant and can help with algorithm and data structure questions. 
      
For example, I can explain:
- Arrays and strings algorithms
- Linked lists operations
- Sorting and searching algorithms
- Dynamic programming
- Tree and graph traversals

Please ask a specific question about one of these topics!`;
    }
  } catch (error) {
    console.error('Error in chatbot conversation:', error);
    return "I'm currently experiencing some issues. Please try again later.";
  }
}

module.exports = {
  generateDailyQuestion,
  generateExplanation,
  chatWithBot
}; 