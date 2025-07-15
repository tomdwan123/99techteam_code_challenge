/**
 * Time complexity: O(n) — linear time with iteration.
 * Space complexity: O(1)
 * Pros: Simple, readable, and avoids math-based rounding issues.
 * Cons: Slower than the formula for large n.
 * This approach uses a loop to calculate the sum.
 * It is efficient for large n, as it does not use recursion.
 * It iterates from 1 to n and accumulates the sum.
 **/
function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Time complexity: O(n)
 * Space complexity: O(n) — root cause is recursive call stack.
 * Pros: Elegant and expressive.
 * Cons: Risk of stack overflow if n is very large. Not recommended in performance-critical code.
 * This approach is less efficient than the iterative one for large n.
 * It uses recursion to calculate the sum.
 **/
function sum_to_n_b(n: number): number {
  if (n <= 1) return n;
  return n + sum_to_n_c(n - 1);
}

/**
 * Time complexity: O(1) — constant time without iteration.
 * Space complexity: O(1)
 * Pros: Fastest and most efficient method.
 * Cons: Prone to overflow with very large n, but not an issue here since n is assumed < Number.MAX_SAFE_INTEGER.
 * This is the most efficient approach.
 * It uses the formula for the sum of the first n natural numbers.
 **/
function sum_to_n_c(n: number): number {
  return (n * (n + 1)) / 2;
}

console.log(`sum_to_n_a(5) = `, sum_to_n_a(5)); // 15
console.log(`sum_to_n_b(5) = `, sum_to_n_b(5)); // 15
console.log(`sum_to_n_c(5) = `, sum_to_n_c(5)); // 15
