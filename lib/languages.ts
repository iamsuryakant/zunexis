export const LANGUAGES = [
  {
    key: "bash",
    label: "Bash",
    id: 46,
    boilerplate: `echo "Hello World"`,
    monaco: "shell",
  },
  {
    key: "python",
    label: "Python 3.12",
    id: 100,
    boilerplate: `print("Hello World")`,
    monaco: "python",
  },
  {
    key: "javascript",
    label: "Node.js 22",
    id: 102,
    boilerplate: `console.log("Hello World");`,
    monaco: "javascript",
  },
  {
    key: "java",
    label: "Java 17",
    id: 91,
    boilerplate: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World");
  }
}`,
    monaco: "java",
  },
  {
    key: "cpp",
    label: "C++ (GCC 14)",
    id: 105,
    boilerplate: `#include <iostream>
using namespace std;

int main() {
  cout << "Hello World";
  return 0;
}`,
    monaco: "cpp",
  },
  {
    key: "c",
    label: "C (GCC 14)",
    id: 103,
    boilerplate: `#include <stdio.h>

int main() {
  printf("Hello World");
  return 0;
}`,
    monaco: "c",
  },
];