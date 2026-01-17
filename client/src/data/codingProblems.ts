import { CodingProblem } from '../types';

export const mockCodingProblems: CodingProblem[] = [
  {
    id: 'two-sum',
    number: 1,
    title: 'Two Sum',
    difficulty: 'Easy',
    topics: ['Array', 'Hash Table'],
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have ***exactly one solution***, and you may not use the *same* element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10⁴',
      '-10⁹ <= nums[i] <= 10⁹',
      '-10⁹ <= target <= 10⁹',
      'Only one valid answer exists.'
    ],
    hints: [
      'A really brute force way would be to search for all possible pairs of numbers but that would be too slow. Again, it\'s best to try out brute force solutions for just for completeness. It is from these brute force solutions that you can come up with optimizations.',
      'So, if we fix one of the numbers, say x, we have to scan the entire array to find the next number y which is value - x where value is the input parameter. Can we change our array somehow so that this search becomes faster?',
      'The second train of thought is, without changing the array, can we use additional space somehow? Like maybe a hash map to speed up the search?'
    ],
    starterCode: {
      'javascript': `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {

};`,
      'python': `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
      'cpp': `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {

    }
};`,
      'java': `class Solution {
    public int[] twoSum(int[] nums, int target) {

    }
}`
    },
    testCases: [
      {
        input: '[2,7,11,15]\n9',
        expectedOutput: '[0,1]'
      },
      {
        input: '[3,2,4]\n6',
        expectedOutput: '[1,2]'
      },
      {
        input: '[3,3]\n6',
        expectedOutput: '[0,1]'
      },
      {
        input: '[1,2,3,4,5]\n9',
        expectedOutput: '[3,4]',
        hidden: true
      }
    ],
    acceptanceRate: 49.2,
    submissions: 12483920,
    editorial: `## Approach 1: Brute Force

The brute force approach is simple. Loop through each element x and find if there is another value that equals to target - x.

### Implementation

\`\`\`javascript
var twoSum = function(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
};
\`\`\`

### Complexity Analysis

- **Time complexity:** O(n²). For each element, we try to find its complement by looping through the rest of the array which takes O(n) time. Therefore, the time complexity is O(n²).

- **Space complexity:** O(1). The space required does not depend on the size of the input array, so only constant space is used.

---

## Approach 2: Hash Table

To improve our runtime complexity, we need a more efficient way to check if the complement exists in the array. If the complement exists, we need to get its index. What is the best way to maintain a mapping of each element in the array to its index? A hash table.

We can reduce the lookup time from O(n) to O(1) by trading space for speed. A hash table is well suited for this purpose because it supports fast lookup in near constant time. I say "near" because if a collision occurred, a lookup could degenerate to O(n) time. However, lookup in a hash table should be amortized O(1) time as long as the hash function was chosen carefully.

### Implementation

\`\`\`javascript
var twoSum = function(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        map.set(nums[i], i);
    }

    return [];
};
\`\`\`

### Complexity Analysis

- **Time complexity:** O(n). We traverse the list containing n elements only once. Each lookup in the table costs only O(1) time.

- **Space complexity:** O(n). The extra space required depends on the number of items stored in the hash table, which stores at most n elements.`,
    solutions: [
      {
        id: 'sol-1',
        author: 'CodeMaster',
        language: 'JavaScript',
        code: `var twoSum = function(nums, target) {
    const map = new Map();

    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];

        if (map.has(complement)) {
            return [map.get(complement), i];
        }

        map.set(nums[i], i);
    }

    return [];
};`,
        explanation: 'Using a hash map to store numbers we\'ve seen and their indices. For each number, we check if its complement exists in the map.',
        upvotes: 2341,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
      },
      {
        id: 'sol-2',
        author: 'PythonPro',
        language: 'Python',
        code: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}

        for i, num in enumerate(nums):
            complement = target - num

            if complement in seen:
                return [seen[complement], i]

            seen[num] = i

        return []`,
        explanation: 'Python dictionary solution with clean enumerate usage. Time and space efficient.',
        upvotes: 1892,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
      }
    ]
  },
  {
    id: 'add-two-numbers',
    number: 2,
    title: 'Add Two Numbers',
    difficulty: 'Medium',
    topics: ['Linked List', 'Math', 'Recursion'],
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      },
      {
        input: 'l1 = [0], l2 = [0]',
        output: '[0]'
      },
      {
        input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]',
        output: '[8,9,9,9,0,0,0,1]'
      }
    ],
    constraints: [
      'The number of nodes in each linked list is in the range [1, 100].',
      '0 <= Node.val <= 9',
      'It is guaranteed that the list represents a number that does not have leading zeros.'
    ],
    starterCode: {
      'javascript': `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {

};`,
      'python': `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        `
    },
    testCases: [
      {
        input: '[2,4,3]\n[5,6,4]',
        expectedOutput: '[7,0,8]'
      },
      {
        input: '[0]\n[0]',
        expectedOutput: '[0]'
      },
      {
        input: '[9,9,9,9,9,9,9]\n[9,9,9,9]',
        expectedOutput: '[8,9,9,9,0,0,0,1]'
      }
    ],
    acceptanceRate: 41.8,
    submissions: 6234891
  }
];
