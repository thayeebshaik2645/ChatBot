// Extended study chatbot - ~500 lines
// Features:
// - Study mode with subjects: c, java, python, dbms
// - Each subject has 10 topics
// - Each topic contains a detailed explanation, example, and a source link
// - UI logic same as original: send button, enter key, greeting, timestamps

const chatBox = document.getElementById('chatBox');
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');

let studyMode = false;
let selectedSubject = null;


// ---------- Subjects object (detailed explanations + examples + links) ----------
const subjects = {
  "c": {
    topics: {
      "variables": `
        <strong>What are variables?</strong><br>
        Variables in C are named storage locations in memory that hold values. When you declare a variable you tell the compiler the data type and name, and optionally an initial value. Variables let programs keep and manipulate information such as numbers, characters and more.<br><br>
        <strong>Why they matter:</strong> Variables let you store user input, intermediate results, counters, flags and more. Choosing the right type (int, float, char, etc.) helps with correctness and memory usage.<br><br>
        <strong>Example:</strong>
        <pre><code>int age = 20;
float price = 99.99;
char grade = 'A';</code></pre>
        <strong>Tip:</strong> Always initialize variables before use to avoid undefined behaviour.<br><br>
        <a href="https://www.geeksforgeeks.org/variables-in-c/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "operators": `
        <strong>Operators in C</strong><br>
        Operators are symbols that perform operations on variables and values. They include arithmetic (+, -, *, /, %), relational (==, !=, >, <), logical (&&, ||, !), bitwise (&, |, ^, <<, >>), assignment (=, +=, -=), and more. Operators are the basic building blocks for expressions and computations.<br><br>
        <strong>How to use:</strong> Use arithmetic operators for calculations, relational operators in conditions, and logical operators to combine boolean expressions. Operator precedence matters: use parentheses to make intent clear.<br><br>
        <strong>Example:</strong>
        <pre><code>int a = 10, b = 3;
int sum = a + b;          // 13
int mod = a % b;          // 1
int isGreater = (a > b);  // 1 (true)
int cond = (a > 5 && b < 5);</code></pre>
        <strong>Tip:</strong> Beware integer division: 5/2 == 2 in integers; use float types for decimal results.<br><br>
        <a href="https://www.geeksforgeeks.org/operators-in-c/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "control statements": `
        <strong>Control statements</strong><br>
        Control statements direct the flow of execution in your program. The main ones are: <code>if</code>, <code>if-else</code>, <code>switch</code> for conditional branching, and <code>goto</code> (rarely used). They let you run different code depending on conditions.<br><br>
        <strong>Usage:</strong> Use <code>if</code> when you have a condition to test, <code>if-else</code> when you need a fallback, and <code>switch</code> when many possible discrete values must be handled. Keep conditions readable and avoid deeply nested branches when possible.<br><br>
        <strong>Example:</strong>
        <pre><code>int score = 75;
if (score >= 90) {
  printf("A");
} else if (score >= 75) {
  printf("B");
} else {
  printf("C or below");
}</code></pre>
        <strong>Tip:</strong> In <code>switch</code>, use <code>break</code> to avoid fall-through unless intentional.<br><br>
        <a href="https://www.tutorialspoint.com/cprogramming/c_decision_making.htm" target="_blank" rel="noopener noreferrer">📘 Read more on Tutorialspoint</a>
      `,
      "loops": `
        <strong>Loops</strong><br>
        Loops let you repeat blocks of code multiple times. C supports <code>for</code>, <code>while</code>, and <code>do-while</code>. Use loops to process arrays, repeat tasks, read inputs until a condition, etc.<br><br>
        <strong>When to use:</strong> Use <code>for</code> when you know iterations beforehand, <code>while</code> when the condition is checked before each iteration, and <code>do-while</code> when the loop must run at least once.<br><br>
        <strong>Example:</strong>
        <pre><code>// for loop
for(int i = 0; i < 5; i++) {
  printf("%d\n", i);
}

// while loop
int i = 0;
while (i < 5) {
  printf("%d\n", i);
  i++;
}</code></pre>
        <strong>Tip:</strong> Prevent infinite loops by ensuring loop conditions will eventually fail.<br><br>
        <a href="https://www.geeksforgeeks.org/c/c-loops/" target="_blank" rel="noopener noreferrer">📘 Read more on Programiz</a>
      `,
      "functions": `
        <strong>Functions</strong><br>
        Functions are reusable blocks of code that perform a specific task. They help divide programs into smaller parts, improve readability and enable reuse. A function has a return type, name, parameters (optional) and a body.<br><br>
        <strong>Benefits:</strong> Modularity, easier debugging, reusability and abstraction. Use functions to split complex problems into simple subproblems.<br><br>
        <strong>Example:</strong>
        <pre><code>int add(int a, int b) {
  return a + b;
}

int main() {
  int result = add(3, 4);
  printf("%d", result); // 7
}</code></pre>
        <strong>Tip:</strong> Keep functions short and focused on a single task; name them clearly.<br><br>
        <a href="https://www.geeksforgeeks.org/functions-in-c/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "arrays": `
        <strong>Arrays</strong><br>
        An array is a collection of elements of the same type stored in contiguous memory. Arrays let you store multiple values under one name and access them using indices starting from 0.<br><br>
        <strong>Key points:</strong> The size is fixed at declaration in standard C (static arrays). Use loops to iterate and process array data. For dynamic sizes, consider dynamic memory (malloc) or higher-level data structures.<br><br>
        <strong>Example:</strong>
        <pre><code>int arr[5] = {1, 2, 3, 4, 5};
for (int i = 0; i < 5; i++) {
  printf("%d\n", arr[i]);
}</code></pre>
        <strong>Tip:</strong> Accessing arr[5] is out-of-bounds; it leads to undefined behavior. Always stay within bounds.<br><br>
        <a href="https://www.tutorialspoint.com/cprogramming/c_arrays.htm" target="_blank" rel="noopener noreferrer">📘 Read more on Tutorialspoint</a>
      `,
      "pointers": `
        <strong>Pointers</strong><br>
        Pointers are variables that store memory addresses. They are powerful for dynamic memory management, arrays, and for efficient passing of large structures to functions. Pointer syntax uses the '*' operator for declaration and '&' to take address.<br><br>
        <strong>Example use-cases:</strong> Dynamic memory with malloc/free, building linked data structures, and passing values by reference to modify originals inside functions.<br><br>
        <strong>Example:</strong>
        <pre><code>int x = 10;
int *p = &x;
printf("%d", *p); // prints 10
*p = 20;
printf("%d", x);  // prints 20</code></pre>
        <strong>Tip:</strong> Always initialize pointers. Dangling or NULL pointer dereferences cause crashes. Use NULL checks and free memory when done.<br><br>
        <a href="https://www.geeksforgeeks.org/pointers-in-c-and-c-set-1-introduction-arithmetic-and-array/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "strings": `
        <strong>Strings</strong><br>
        In C, strings are arrays of characters terminated by the null character '\\0'. There is no native string type (like in higher-level languages), so you use character arrays and string functions from &lt;string.h&gt;.<br><br>
        <strong>Operations:</strong> Copying, concatenation, length calculation, comparison and searching using functions like strcpy, strcat, strlen, strcmp, strstr etc.<br><br>
        <strong>Example:</strong>
        <pre><code>char name[20] = "Hello";
printf("%s", name);      // prints Hello
printf("%lu", strlen(name)); // prints length (5)</code></pre>
        <strong>Tip:</strong> Always ensure enough space for the terminating '\\0' when creating or concatenating strings.<br><br>
        <a href="https://www.tutorialspoint.com/cprogramming/c_strings.htm" target="_blank" rel="noopener noreferrer">📘 Read more on Tutorialspoint</a>
      `,
      "structures": `
        <strong>Structures</strong><br>
        A structure (struct) allows grouping variables of different types under a single name. They are useful for modeling complex data types, like a student with id, name and marks.<br><br>
        <strong>Usage:</strong> Define a struct type, then create variables of that type. You can pass structs to functions (by value or by pointer) and store arrays of structs.<br><br>
        <strong>Example:</strong>
        <pre><code>struct Student {
  int id;
  char name[50];
  float marks;
};

struct Student s1 = {1, "Ravi", 85.5};
printf("%s", s1.name);</code></pre>
        <strong>Tip:</strong> When passing large structs, pass pointers to avoid expensive copying.<br><br>
        <a href="https://www.geeksforgeeks.org/structures-c/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "file handling": `
        <strong>File handling</strong><br>
        File handling lets you read and write data to files. Standard functions include fopen, fclose, fprintf, fscanf, fread, fwrite. Files are opened with modes like "r", "w", "a", "rb", "wb".<br><br>
        <strong>Example:</strong> Use fopen to open, fprintf/fscanf for formatted I/O, fread/fwrite for binary I/O, and always fclose the file when done.<br><br>
        <pre><code>FILE *fp = fopen("data.txt", "w");
if (fp != NULL) {
  fprintf(fp, "Hello file\\n");
  fclose(fp);
}</code></pre>
        <strong>Tip:</strong> Check for NULL after fopen and handle errors. Close files to free resources.<br><br>
        <a href="https://www.tutorialspoint.com/cprogramming/c_file_io.htm" target="_blank" rel="noopener noreferrer">📘 Read more on Tutorialspoint</a>
      `
    }
  },

  "java": {
    topics: {
      "classes": `
        <strong>Classes</strong><br>
        A class is a blueprint for creating objects in Java. It encapsulates data (fields) and behaviors (methods). Classes model real-world entities and let you create multiple instances (objects) with the same structure.<br><br>
        <strong>Example:</strong>
        <pre><code>public class Car {
  int speed;
  String model;
  void drive() {
    System.out.println("Driving");
  }
}</code></pre>
        <strong>Tip:</strong> Keep fields private and expose behavior through public methods for encapsulation.<br><br>
        <a href="https://www.javatpoint.com/java-class-and-object" target="_blank" rel="noopener noreferrer">📘 Read more on Javatpoint</a>
      `,
      "objects": `
        <strong>Objects</strong><br>
        An object is an instance of a class with actual values for fields. Objects hold state (field values) and provide behavior through methods. To create an object, use the new keyword.<br><br>
        <strong>Example:</strong>
        <pre><code>Car c1 = new Car();
c1.speed = 80;
c1.drive();</code></pre>
        <strong>Tip:</strong> Constructors initialize new objects. Use multiple constructors for flexibility.<br><br>
        <a href="https://www.geeksforgeeks.org/objects-in-java/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "inheritance": `
        <strong>Inheritance</strong><br>
        Inheritance lets a class (child) derive properties and methods from another class (parent). It promotes code reuse and establishes an "is-a" relationship.<br><br>
        <strong>Example:</strong>
        <pre><code>class Animal {
  void eat() { System.out.println("Eat"); }
}
class Dog extends Animal {
  void bark() { System.out.println("Bark"); }
}</code></pre>
        <strong>Tip:</strong> Use inheritance where it makes logical sense; prefer composition when behavior-sharing is not an "is-a" relationship.<br><br>
        <a href="https://www.geeksforgeeks.org/inheritance-in-java/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "polymorphism": `
        <strong>Polymorphism</strong><br>
        Polymorphism means "many forms". In Java it appears as method overloading (same method name, different parameters) and method overriding (child provides a specific implementation of a parent method). It enables flexible and extensible code.<br><br>
        <strong>Example (overriding):</strong>
        <pre><code>class Animal {
  void sound() { System.out.println("Some sound"); }
}
class Cat extends Animal {
  void sound() { System.out.println("Meow"); }
}</code></pre>
        <strong>Tip:</strong> Use polymorphism to write code that works with base class types while concrete behavior comes from subclasses.<br><br>
        <a href="https://www.javatpoint.com/runtime-polymorphism-in-java" target="_blank" rel="noopener noreferrer">📘 Read more on Javatpoint</a>
      `,
      "abstraction": `
        <strong>Abstraction</strong><br>
        Abstraction hides complex implementation details and exposes only necessary parts. In Java, use abstract classes and interfaces to define contracts for subclasses without exposing internals.<br><br>
        <strong>Example:</strong>
        <pre><code>abstract class Shape {
  abstract void draw();
}
class Circle extends Shape {
  void draw() { System.out.println("Draw circle"); }
}</code></pre>
        <strong>Tip:</strong> Use interfaces for pure contracts and abstract classes when shared code is needed.<br><br>
        <a href="https://www.geeksforgeeks.org/abstraction-in-java/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "encapsulation": `
        <strong>Encapsulation</strong><br>
        Encapsulation bundles data and methods that operate on the data into one unit (class) and restricts direct access to some components. Use access modifiers (private, protected, public) and provide getters/setters for controlled access.<br><br>
        <strong>Example:</strong>
        <pre><code>public class Person {
  private String name;
  public String getName(){ return name; }
  public void setName(String n){ name = n; }
}</code></pre>
        <strong>Tip:</strong> Encapsulation improves maintainability and prevents external code from putting objects into invalid states.<br><br>
        <a href="https://www.javatpoint.com/encapsulation-in-java" target="_blank" rel="noopener noreferrer">📘 Read more on Javatpoint</a>
      `,
      "arrays": `
        <strong>Arrays in Java</strong><br>
        Arrays hold multiple values of the same type. Java arrays are objects; they know their own length and provide indexed access starting at 0.<br><br>
        <strong>Example:</strong>
        <pre><code>int[] nums = {1,2,3,4};
for (int i = 0; i < nums.length; i++) {
  System.out.println(nums[i]);
}</code></pre>
        <strong>Tip:</strong> For dynamic-size lists use ArrayList from java.util instead of arrays.<br><br>
        <a href="https://www.javatpoint.com/java-array" target="_blank" rel="noopener noreferrer">📘 Read more on Javatpoint</a>
      `,
      "exception handling": `
        <strong>Exception handling</strong><br>
        Exceptions are runtime problems; Java provides try-catch-finally to handle them gracefully. Throw exceptions to notify calling code when things go wrong. Use checked exceptions for recoverable problems and unchecked for programming errors.<br><br>
        <strong>Example:</strong>
        <pre><code>try {
  int x = Integer.parseInt("abc");
} catch (NumberFormatException e) {
  System.out.println("Invalid number");
} finally {
  System.out.println("Always runs");
}</code></pre>
        <strong>Tip:</strong> Catch specific exceptions; avoid catching Exception globally unless necessary.<br><br>
        <a href="https://www.geeksforgeeks.org/exception-handling-java/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "multithreading": `
        <strong>Multithreading</strong><br>
        Multithreading allows concurrent execution of two or more threads for faster and responsive programs. Java offers Thread class and Runnable interface along with high-level concurrency utilities in java.util.concurrent.<br><br>
        <strong>Example:</strong>
        <pre><code>class MyThread extends Thread {
  public void run() { System.out.println("Thread running"); }
}
new MyThread().start();</code></pre>
        <strong>Tip:</strong> Be careful with shared data, use synchronized blocks or higher-level constructs (locks, atomic types) to avoid race conditions.<br><br>
        <a href="https://www.javatpoint.com/multithreading-in-java" target="_blank" rel="noopener noreferrer">📘 Read more on Javatpoint</a>
      `,
      "file handling": `
        <strong>File handling in Java</strong><br>
        Java has classes for file I/O in java.io and java.nio packages. Use FileReader/FileWriter or BufferedReader/BufferedWriter for text, FileInputStream/FileOutputStream for binary, and Files utility for simpler operations.<br><br>
        <strong>Example:</strong>
        <pre><code>try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
  String line;
  while((line = br.readLine()) != null) {
    System.out.println(line);
  }
}</code></pre>
        <strong>Tip:</strong> Use try-with-resources to auto-close streams and handle exceptions cleanly.<br><br>
        <a href="https://www.geeksforgeeks.org/file-handling-in-java-using-filewriter-filereader/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `
    }
  },

  "python": {
    topics: {
      "variables": `
        <strong>Variables in Python</strong><br>
        Variables are created when you assign a value to them. Python is dynamically typed, so a variable can hold different types over its lifetime. Names are references to objects.<br><br>
        <strong>Example:</strong>
        <pre><code>x = 5
x = "hello"
print(x)</code></pre>
        <strong>Tip:</strong> Use meaningful variable names and follow snake_case naming style for readability.<br><br>
        <a href="https://www.w3schools.com/python/python_variables.asp" target="_blank" rel="noopener noreferrer">📘 Read more on W3Schools</a>
      `,
      "datatypes": `
        <strong>Data types</strong><br>
        Common built-in types are <code>int, float, str, bool, list, tuple, set, dict</code>. Each type offers different operations and semantics (mutable vs immutable). Understanding types helps you pick the right structure for the job.<br><br>
        <strong>Example:</strong>
        <pre><code>n = 10         # int
f = 3.14       # float
s = "hey"      # str
lst = [1,2,3]  # list
d = {'a': 1}   # dict</code></pre>
        <strong>Tip:</strong> Use tuples for fixed collections and lists for changeable sequences; dictionaries map keys to values efficiently.<br><br>
        <a href="https://docs.python.org/3/library/stdtypes.html" target="_blank" rel="noopener noreferrer">📘 Read more on Python Docs</a>
      `,
      "conditions": `
        <strong>Conditions</strong><br>
        Use <code>if</code>, <code>elif</code>, <code>else</code> to branch execution. Conditions are expressions that evaluate to True or False. Python uses indentation to define blocks.<br><br>
        <strong>Example:</strong>
        <pre><code>x = 10
if x > 10:
  print("Greater")
elif x == 10:
  print("Equal")
else:
  print("Less")</code></pre>
        <strong>Tip:</strong> Keep condition logic readable; prefer descriptive boolean expressions over nested confusing checks.<br><br>
        <a href="https://www.geeksforgeeks.org/python-if-else/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "loops": `
        <strong>Loops in Python</strong><br>
        Python has <code>for</code> and <code>while</code> loops. <code>for</code> iterates over iterable objects (lists, strings, ranges) and is often preferred for clarity. Use <code>while</code> when repeating until a condition changes.<br><br>
        <strong>Example:</strong>
        <pre><code>for i in range(5):
  print(i)

i = 0
while i < 5:
  print(i)
  i += 1</code></pre>
        <strong>Tip:</strong> Use enumerate() when you need index and value together: <code>for i, v in enumerate(lst):</code><br><br>
        <a href="https://www.geeksforgeeks.org/loops-in-python/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "functions": `
        <strong>Functions in Python</strong><br>
        Use the <code>def</code> keyword to create functions. Functions help reuse logic and improve readability. They can return values and accept default, keyword, and variable-length arguments.<br><br>
        <strong>Example:</strong>
        <pre><code>def add(a, b=0):
  return a + b

print(add(2,3))  # 5
print(add(2))    # 2</code></pre>
        <strong>Tip:</strong> Document functions with docstrings and keep them single-purpose for easier testing.<br><br>
        <a href="https://docs.python.org/3/tutorial/controlflow.html#defining-functions" target="_blank" rel="noopener noreferrer">📘 Read more on Python Docs</a>
      `,
      "lists": `
        <strong>Lists</strong><br>
        Lists are ordered, mutable collections. Use them to store sequences of items. They support indexing, slicing, and many built-in methods like append, pop, extend, insert, sort, reverse.<br><br>
        <strong>Example:</strong>
        <pre><code>fruits = ['apple', 'banana']
fruits.append('orange')
for f in fruits:
  print(f)</code></pre>
        <strong>Tip:</strong> Use list comprehensions for compact and readable transformations: <code>[x*2 for x in nums]</code>.<br><br>
        <a href="https://www.w3schools.com/python/python_lists.asp" target="_blank" rel="noopener noreferrer">📘 Read more on W3Schools</a>
      `,
      "tuples": `
        <strong>Tuples</strong><br>
        Tuples are ordered, immutable sequences. Use them for fixed collections where immutability is desirable (e.g., coordinates). They are lightweight and can be used as keys in dictionaries if they contain only immutable items.<br><br>
        <strong>Example:</strong>
        <pre><code>t = (1, 2, 3)
# t[0] = 5  # Error: tuples are immutable</code></pre>
        <strong>Tip:</strong> Use parentheses or just commas: <code>t = 1, 2, 3</code>.<br><br>
        <a href="https://www.w3schools.com/python/python_tuples.asp" target="_blank" rel="noopener noreferrer">📘 Read more on W3Schools</a>
      `,
      "dictionaries": `
        <strong>Dictionaries</strong><br>
        Dicts store key-value pairs and are unordered (in older Python versions) but keep insertion order in modern Python. They’re great for lookups by key and storing structured data.<br><br>
        <strong>Example:</strong>
        <pre><code>student = {'name': 'Ali', 'age': 20}
print(student['name'])</code></pre>
        <strong>Tip:</strong> Use dict.get('key', default) to avoid KeyError when key may not exist.<br><br>
        <a href="https://www.w3schools.com/python/python_dictionaries.asp" target="_blank" rel="noopener noreferrer">📘 Read more on W3Schools</a>
      `,
      "classes": `
        <strong>Classes in Python</strong><br>
        Classes bundle data and behavior. Python classes are flexible: define __init__ for constructors, use self to access instance attributes, and support inheritance and polymorphism.<br><br>
        <strong>Example:</strong>
        <pre><code>class Dog:
  def __init__(self, name):
    self.name = name

  def bark(self):
    print(self.name + " says woof")

d = Dog("Rex")
d.bark()</code></pre>
        <strong>Tip:</strong> Use @property for getters/setters to keep a clean API without exposing internals directly.<br><br>
        <a href="https://docs.python.org/3/tutorial/classes.html" target="_blank" rel="noopener noreferrer">📘 Read more on Python Docs</a>
      `,
      "file handling": `
        <strong>File handling in Python</strong><br>
        Use open() to open files and read(), readline(), readlines() or write() to operate. Prefer with-statement (context manager) to auto-close files.<br><br>
        <strong>Example:</strong>
        <pre><code>with open('data.txt', 'r') as f:
  contents = f.read()
  print(contents)</code></pre>
        <strong>Tip:</strong> Use encoding parameter for non-ASCII files: open('file', 'r', encoding='utf-8').<br><br>
        <a href="https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files" target="_blank" rel="noopener noreferrer">📘 Read more on Python Docs</a>
      `
    }
  },

  "dbms": {
    topics: {
      "introduction": `
        <strong>What is DBMS?</strong><br>
        A Database Management System (DBMS) is software that stores, retrieves, and manages data in databases. It provides an interface for users to create, query, update and manage data while ensuring integrity, security and concurrency control.<br><br>
        <strong>Example products:</strong> MySQL, PostgreSQL, Oracle, SQL Server, SQLite.<br><br>
        <strong>Tip:</strong> Understand relational vs non-relational databases and choose based on data model and scalability needs.<br><br>
        <a href="https://www.geeksforgeeks.org/introduction-of-dbms-database-management-system-set-1/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "er model": `
        <strong>ER Model</strong><br>
        The Entity-Relationship (ER) model represents data with entities (objects) and relationships between them. Entities have attributes and relationships can be one-to-one, one-to-many or many-to-many. ER diagrams are used in database design to visualize structure before implementation.<br><br>
        <strong>Tip:</strong> Convert ER diagrams into tables carefully handling relationships (foreign keys and join tables for many-to-many).<br><br>
        <a href="https://www.tutorialspoint.com/dbms/dbms_entity_relationship_model.htm" target="_blank" rel="noopener noreferrer">📘 Read more on Tutorialspoint</a>
      `,
      "normalization": `
        <strong>Normalization</strong><br>
        Normalization is the process of organizing data to reduce redundancy and improve integrity. Normal forms (1NF, 2NF, 3NF, BCNF) are steps to structure tables so updates and deletions don't cause anomalies.<br><br>
        <strong>Example:</strong> Move repeating groups to separate tables (1NF) and ensure that non-key attributes depend fully on the primary key (2NF) and that there are no transitive dependencies (3NF).<br><br>
        <strong>Tip:</strong> Normalize until you remove redundancy but be pragmatic—some denormalization helps performance in read-heavy systems.<br><br>
        <a href="https://www.geeksforgeeks.org/normal-forms-in-dbms/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "sql": `
        <strong>SQL (Structured Query Language)</strong><br>
        SQL is the language used to interact with relational databases. It includes DDL (CREATE, ALTER), DML (SELECT, INSERT, UPDATE, DELETE), DCL (GRANT, REVOKE) and TCL (COMMIT, ROLLBACK). Learn to write queries to fetch, filter, sort and aggregate data.<br><br>
        <strong>Example:</strong>
        <pre><code>SELECT name, age FROM students WHERE age &gt;= 18 ORDER BY name;</code></pre>
        <strong>Tip:</strong> Use indexes on columns used in WHERE and JOIN to improve performance, but index selectively as they cost writes.<br><br>
        <a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener noreferrer">📘 Read more on W3Schools</a>
      `,
      "joins": `
        <strong>Joins</strong><br>
        Joins combine rows from two or more tables based on related columns. Types: INNER JOIN (matching rows), LEFT JOIN (all left rows + matches), RIGHT JOIN (all right rows + matches), FULL JOIN (all rows from both sides). Joins are essential for relational queries.<br><br>
        <strong>Example:</strong>
        <pre><code>SELECT s.name, c.course_name
FROM students s
JOIN courses c ON s.course_id = c.id;</code></pre>
        <strong>Tip:</strong> Always use explicit JOIN syntax (not comma-separated) for clarity and maintainability.<br><br>
        <a href="https://www.geeksforgeeks.org/sql-joins/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "transactions": `
        <strong>Transactions</strong><br>
        A transaction is a set of DB operations that must succeed or fail as a unit. Transactions follow ACID properties: Atomicity, Consistency, Isolation, Durability. Use transactions when many operations must be applied together (bank transfers, booking systems).</strong><br><br>
        <strong>Example:</strong>
        <pre><code>BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;</code></pre>
        <strong>Tip:</strong> Use rollback to revert partial changes on failures and tune isolation levels to balance correctness vs concurrency.<br><br>
        <a href="https://www.geeksforgeeks.org/transactions-in-dbms/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "indexes": `
        <strong>Indexes</strong><br>
        Indexes speed up searches by providing quick lookups similar to a book index. They are created on columns often used in WHERE, ORDER BY, or JOIN. However, indexes increase storage and slow down write operations (INSERT/UPDATE/DELETE).\n<br><br>
        <strong>Example:</strong>
        <pre><code>CREATE INDEX idx_name ON students(name);</code></pre>
        <strong>Tip:</strong> Use composite indexes for multi-column queries and monitor index usage to remove unused ones.<br><br>
        <a href="https://www.geeksforgeeks.org/indexing-in-databases-set-1/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "keys": `
        <strong>Keys</strong><br>
        Keys uniquely identify rows and form relationships between tables. Primary Key uniquely identifies rows. Foreign Key references a primary key in another table to establish referential integrity. Candidate keys and unique keys are other important concepts.<br><br>
        <strong>Example:</strong>
        <pre><code>CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(100)
);

CREATE TABLE enrollments (
  student_id INT,
  FOREIGN KEY (student_id) REFERENCES students(id)
);</code></pre>
        <strong>Tip:</strong> Use surrogate keys (auto-increment IDs) where natural keys are problematic, but understand trade-offs.<br><br>
        <a href="https://www.geeksforgeeks.org/keys-in-dbms-set-1/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "concurrency control": `
        <strong>Concurrency control</strong><br>
        Concurrency control manages simultaneous operations without conflicts. Techniques include locks, MVCC (multi-version concurrency control), and optimistic/pessimistic locking strategies. They ensure data consistency when multiple users access the database concurrently.<br><br>
        <strong>Tip:</strong> Understand isolation levels (READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE) and choose the right trade-offs for your application.<br><br>
        <a href="https://www.geeksforgeeks.org/concurrency-control-in-dbms/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `,
      "recovery": `
        <strong>Recovery</strong><br>
        Recovery mechanisms ensure database durability and consistency after crashes or failures. Techniques involve write-ahead logging, checkpoints, and backups. Proper backup and recovery planning reduces downtime and data loss risks.<br><br>
        <strong>Tip:</strong> Regularly test your backup and restore procedures in a sandbox environment to ensure they work under time pressure.<br><br>
        <a href="https://www.geeksforgeeks.org/recovery-concepts-in-dbms/" target="_blank" rel="noopener noreferrer">📘 Read more on GeeksforGeeks</a>
      `
    }
  }
};

// ---------- UI helper to add messages ----------
function addMessage(text, sender='user') {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-message ' + sender;

  const avatar = document.createElement('div');
  avatar.className = 'avatar';
  avatar.textContent = sender === 'bot' ? '🤖' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  // allow HTML inside bubble (we trust content coming from our subjects object)
  bubble.innerHTML = `${text} <span class="timestamp">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>`;

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ---------- Bot reply logic ----------
function botReply(userText) {
  const text = userText.trim().toLowerCase();

  // Activate study mode
  if (text.includes("study")) {
    studyMode = true;
    selectedSubject = null;
    addMessage("Sure 😊 I can help you study! Please choose a subject: <b>C</b>, <b>Java</b>, <b>Python</b>, <b>DBMS</b>", 'bot');
    return;
  }

  // If we are in study mode and subject not chosen yet
  if (studyMode && !selectedSubject) {
    if (subjects[text]) {
      selectedSubject = text;
      const topicList = Object.keys(subjects[text].topics)
        .map((t, i) => `${i+1}. ${t}`)
        .join("<br>");
      addMessage(`Great! Here are some topics in <b>${text.toUpperCase()}</b>: <br>${topicList}<br><br>Type a topic name to learn more. (e.g., "variables", "functions")`, 'bot');
    } else {
      addMessage("Please choose from: <b>C</b>, <b>Java</b>, <b>Python</b>, <b>DBMS</b> (type exactly the subject name).", 'bot');
    }
    return;
  }

  // If we are in study mode and subject selected, show topic details
  if (studyMode && selectedSubject) {
    const topicAnswer = subjects[selectedSubject].topics[text];
    if (topicAnswer) {
      addMessage(topicAnswer, 'bot');
    } else {
      // If user wants to change subject
      if (text === 'change' || text === 'switch') {
        selectedSubject = null;
        addMessage("Okay, please choose another subject: C, Java, Python, DBMS", 'bot');
      } else if (text === 'exit' || text === 'stop') {
        studyMode = false;
        selectedSubject = null;
        addMessage("Exited study mode. How else can I help you?", 'bot');
      } else {
        addMessage("Please choose a valid topic from the list or type 'change' to select another subject, or 'exit' to leave study mode.", 'bot');
      }
    }
    return;
  }

  // Default replies when not in study mode
  const replies = {
    "hello": "Hi there! 👋 I'm your study assistant. You can type 'study' to start learning topics in C, Java, Python, or DBMS.",
    "hi": "Hello! 😊 Type 'study' to see subjects I can help you with.",
    "bye": "Goodbye! 👋 Happy studying — come back anytime.",
    "help": "You can type 'study' to start. When in study mode: choose a subject (C, Java, Python, DBMS) then a topic name to get detailed explanations + examples + links."
  };

  if (replies[text]) {
    addMessage(replies[text], 'bot');
  } else {
    addMessage("🤖 Sorry, I don’t understand that yet. Type 'help' or 'study' to begin.", 'bot');
  }
}


// ---------- Event listeners ----------
sendBtn.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (!message) return;
  addMessage(message, 'user');
  userInput.value = '';

  // small delay to feel natural
  setTimeout(() => botReply(message), 500);
});

userInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendBtn.click();
});

// Greeting on load
window.addEventListener('load', () => {
  setTimeout(() => {
    addMessage("Hello! 👋 I’m your assistant. You can ask for help in study anytime — just type 'study'!", 'bot');
  }, 500);
});

// ---------- Optional helper: reset study mode from console ----------
function resetStudy() {
  studyMode = false;
  selectedSubject = null;
  console.log("Study mode reset.");
}

// Expose reset function for debugging in console
window.resetStudy = resetStudy;

/* End of file
   This file intentionally verbose: every topic includes explanation,
   code example and an external link to learn more.
   You can shorten individual topic strings if needed or add more topics.
*/
