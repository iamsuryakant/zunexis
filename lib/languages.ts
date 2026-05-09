export const LANGUAGES = [
  { key: "javascript", label: "JavaScript", boilerplate: 'console.log("Hello Zunexis!");', judgeId: 63 },
  { key: "typescript", label: "TypeScript", boilerplate: 'console.log("Hello Zunexis!");', judgeId: 83 },
  { key: "python", label: "Python", boilerplate: 'print("Hello Zunexis!")', judgeId: 71 },
  { key: "java", label: "Java", boilerplate: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello Zunexis!");\n  }\n}', judgeId: 62 },
  { key: "cpp", label: "C++", boilerplate: '#include <iostream>\n\nint main() {\n    std::cout << "Hello Zunexis!" << std::endl;\n    return 0;\n}', judgeId: 54 },
  { key: "c", label: "C", boilerplate: '#include <stdio.h>\n\nint main() {\n    printf("Hello Zunexis!\\n");\n    return 0;\n}', judgeId: 50 },
  { key: "go", label: "Go", boilerplate: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello Zunexis!")\n}', judgeId: 60 },
  { key: "rust", label: "Rust", boilerplate: 'fn main() {\n    println!("Hello Zunexis!");\n}', judgeId: 73 },
  { key: "ruby", label: "Ruby", boilerplate: 'puts "Hello Zunexis!"', judgeId: 72 },
];

export const getLanguageByKey = (key: string) => LANGUAGES.find(l => l.key === key);