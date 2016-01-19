# Module Documentation

The below questions should be answered (in detail!) regarding your submission.

##### 1. Reflect on how you "learned" to use the library and write the examples, c.f the "Unfamiliar APIs" reading. What is one aspect of the module's code that made is easy to understand? What is one change that would have made it easier?
> The main way I learn how to use libaray and APIs is to read through the README file, combined with real-world examples and use-cases, which followed my past experience of learning new APIs and modules. Specifically, for this module, I read some cases and related them with my past experience to form a clear logic structure in my mind. I walk through the whole source codes and try to understand the logic among different functions by jumping one to another, which I think is a good practice to quickly form a logic map of an API. When confronting with some words or parameters I cannot understand, I will try to find logic answer in other functions in the source code. If failed, I will try to google it, which is a typical way to learn new things. Also, when writing my own examples, I follow the way of trial-and-error to finalize my understanding about this module. This module is clear in that the naming and format of codes is very self-explained in most cases. However, if author could add more comments will definitely make it more easier to understand.


##### 2. Consider the process of writing comments that "raise the level of abstraction." What does this mean to you? If you had to explain to a new CS142 student how to write an effective comment, what would you say? #####
> Sometimes the phrase of raising abstraction is a little hard to understand for me when wrirting some comments. I mean some functions is too straightforward to be commented. How can I raise that function's abstraction? The mechanism is clear, the usage is clear, the purpose is also clear. That is the time when I get stuck for a while. In my opinion, "raise the level of abstraction" means that summarizing the purpose or idea about why I need to create this function and what result will it be. From my own experience, I would like to say: don't write too much for explaining your code! Our codes SHOULD be self-explained in maximum and try to reduce the number of comment if possible. Maintaining this concept in mind will force ourselves to write clean and clever comments I think.


##### 3. Approximately how many hours did it take you to complete this assignment? #####
> Roughtly 4 hours. It's not hard to try to understand small modules. But the time will go wildly up if wanna understand large modules like npm -- it is a trade-off.


##### 4. Did you receive help from any other sources (classmates, etc)? If so, please list who (be specific!). #####
> Most of the time the only source of knowlege is from the module itself. I tried to google some common questions but not specifically used in this module.


##### 5. Did you encounter any problems in this assignment we should warn students about in the future? How can we make the assignment better? #####
> Well yes. When I try to generate HTML file to explain APIs, The JSDoc CANNOT parse octal representation, which is used to control colors of text etc. so that I have to CHANGE the source code! It cannot be configured because JSDoc automatically use strict mode in JS parser and I cannot find anywhere I can configure it.
