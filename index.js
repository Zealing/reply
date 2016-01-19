/** This is a description of the reply module */

/** 
 * require readline module to listening stdin and stdout to interact with user
 */
var rl, readline = require('readline');

// create IO interface to user
var get_interface = function(stdin, stdout) {
  if (!rl) rl = readline.createInterface(stdin, stdout);
  else stdin.resume(); // interface exists
  return rl;
}

/**
 * public API to confirm user's input as Yes / No and return self-defined callback function
 * @param {Object} message - the message object from user's input
 * @param {function} callback - the self-defined callback function by developers 
 */
var confirm = exports.confirm = function(message, callback) {

  // the question developer want to ask user - reply yes / no
  var question = {
    'reply': {
      type: 'confirm',
      message: message,
      default: 'yes'
    }
  }

  // using another public API to get user reply and return to a self-defined callback function
  get(question, function(err, answer) {
    if (err) return callback(err);
    callback(null, answer.reply === true || answer.reply == 'yes');
  });

};

/**
 * public API to get user's input from stdin and prompt message or reply to stdout
 * @param {Object} options - the options object, containing self-defined json format details about questions developers want users to reply
 * @param {function} callback - the self-defined callback function after user entering reply message
 */
var get = exports.get = function(options, callback) {

  if (!callback) return; // no point in continuing

  // type check for options
  if (typeof options != 'object')
    return callback(new Error("Please pass a valid options object."))

  // create the interface for IO interaction 
  var answers = {},
      stdin = process.stdin,
      stdout = process.stdout,
      fields = Object.keys(options);

  // the helper function to close this function 
  var done = function() {
    close_prompt();
    callback(null, answers);
  }

  // the helper function to close the prompt IO
  var close_prompt = function() {
    stdin.pause();
    if (!rl) return;
    rl.close();
    rl = null;
  }

  /** 
   * helper function to get default message settled by developer
   * @param {Object} key - the json format object list containing all keys developer defined in options.jon file
   * @param {Object} partial_answers - if the default object is a function, partial_answers will be the parameter into that function
   * @return {Object} A json format object containing default message defined by developer
   */
  var get_default = function(key, partial_answers) {
    if (typeof options[key] == 'object')
      return typeof options[key].default == 'function' ? options[key].default(partial_answers) : options[key].default;
    else
      return options[key];
  }

  /**
   * helper function to get the reply type from user
   * @param {Object} user's input
   * @return {String} guess user's reply as a string 
   */
  var guess_type = function(reply) {

    if (reply.trim() == '')
      return;
    else if (reply.match(/^(true|y(es)?)$/))
      return true;
    else if (reply.match(/^(false|n(o)?)$/))
      return false;
    else if ((reply*1).toString() === reply)
      return reply*1;

    return reply;
  }

  /**
   * helper function to validate if user's input is legal or not
   * @param {Object} key - json format object containing keys defined by developer
   * @param {Object} answer - user's input
   * @return {boolean} return true if user's reply is legal, otherwise return false
   */
  var validate = function(key, answer) {

    if (typeof answer == 'undefined')
      return options[key].allow_empty || typeof get_default(key) != 'undefined';
    else if(regex = options[key].regex)
      return regex.test(answer);
    else if(options[key].options)
      return options[key].options.indexOf(answer) != -1; // test whether can fint answer in options or not
    else if(options[key].type == 'confirm')
      return typeof(answer) == 'boolean'; // answer was given so it should be
    else if(options[key].type && options[key].type != 'password')
      return typeof(answer) == options[key].type;

    return true;

  }

  /**
   * helper function to show given key's error message defined by developer to stdout
   * @param {Object} key - defined by developer, a Json format object
   */
  var show_error = function(key) {
    var str = options[key].error ? options[key].error : 'Invalid value.';

    if (options[key].options)
        str += ' (options are ' + options[key].options.join(', ') + ')';

    // \033 - a way to change the font color 
    // stdout.write("\033[31m" + str + "\033[0m" + "\n");
    stdout.write(str);
  }

  /**
   * helper function to show self-defined message by developer to stdout
   * @param {Object} key - self-defined Json format object 
   */
  var show_message = function(key) {
    var msg = '';

    if (text = options[key].message)
      msg += text.trim() + ' ';

    if (options[key].options)
      msg += '(options are ' + options[key].options.join(', ') + ')';

    // if (msg != '') stdout.write("\033[1m" + msg + "\033[0m\n");
    if (msg != '') stdout.write(msg);
  }

  // taken from commander lib
  // an asynchronous function to track user entering password, showing as mask '*'
  var wait_for_password = function(prompt, callback) {

    var buf = '',
        mask = '*';

    var keypress_callback = function(c, key) {

      if (key && (key.name == 'enter' || key.name == 'return')) {
        stdout.write("\n");
        stdin.removeAllListeners('keypress');
        // stdin.setRawMode(false);
        return callback(buf);
      }

      // if press ctrl + c --> quit
      if (key && key.ctrl && key.name == 'c')
        close_prompt();

      if (key && key.name == 'backspace') {
        buf = buf.substr(0, buf.length-1);
        var masked = '';
        for (i = 0; i < buf.length; i++) { masked += mask; }
        // stdout.write('\r\033[2K' + prompt + masked);
        stdout.write(prompt + masked);
      } else {
        stdout.write(mask);
        buf += c;
      }

    };

    stdin.on('keypress', keypress_callback);
  }

  /** 
   * main function to check user's reply
   * @param {Integer} index - used to point to different question developer wants to ask
   * @param {Object} curr_key - self-defined Json object pointing to specific question
   * @param {function} fallback - self-defined return function if user's reply is illegal
   * @param {Object} reply - user's input
   */
  var check_reply = function(index, curr_key, fallback, reply) {
    var answer = guess_type(reply); // call helper function mentioned above
    var return_answer = (typeof answer != 'undefined') ? answer : fallback;

    if (validate(curr_key, answer))
      next_question(++index, curr_key, return_answer); // if it is legal, just to next question using another helper function
    else
      show_error(curr_key) || next_question(index); // repeats current
  }

  var dependencies_met = function(conds) {
    for (var key in conds) {
      var cond = conds[key];
      if (cond.not) { // object, inverse
        if (answers[key] === cond.not)
          return false;
      } else if (cond.in) { // array 
        if (cond.in.indexOf(answers[key]) == -1) 
          return false;
      } else {
        if (answers[key] !== cond)
          return false; 
      }
    }

    return true;
  }

  /** 
   * helper function to jump to next question after user entering a reply about previous question
   * @param {Integer} index - pointing to different question
   * @param {Object} prev_key - previous key object replied by user before
   * @param {String} answer - previous question's answer by user -- should be a valid string 
   * @return {function} depending on situations, return different function to call
   */
  var next_question = function(index, prev_key, answer) {
    if (prev_key) answers[prev_key] = answer; 

    var curr_key = fields[index];
    if (!curr_key) return done(); // if no question in that index, terminate this process

    // if there is other question this question depends on, jump to that question at first
    if (options[curr_key].depends_on) {
      if (!dependencies_met(options[curr_key].depends_on))
        return next_question(++index, curr_key, undefined); // undefined because no answer yet for this question
    }

    var prompt = (options[curr_key].type == 'confirm') ?
      ' - yes/no: ' : " - " + curr_key + ": ";

    var fallback = get_default(curr_key, answers);
    if (typeof(fallback) != 'undefined' && fallback !== '')
      prompt += "[" + fallback + "] ";

    // show this question's message 
    show_message(curr_key);

    if (options[curr_key].type == 'password') {

      var listener = stdin._events.keypress; // to reassign down later
      stdin.removeAllListeners('keypress');

      // stdin.setRawMode(true);
      stdout.write(prompt);

      wait_for_password(prompt, function(reply) {
        stdin._events.keypress = listener; // reassign
        check_reply(index, curr_key, fallback, reply)
      });

    } else {
      // if the type of this reply is not password, check reply as usual
      rl.question(prompt, function(reply) {
        check_reply(index, curr_key, fallback, reply);
      });

    }

  }

  // genearte IO interface
  rl = get_interface(stdin, stdout);
  next_question(0); // start from 0

  // listening on close command, do terminating check
  rl.on('close', function() {
    close_prompt(); // just in case

    var given_answers = Object.keys(answers).length;
    if (fields.length == given_answers) return;

    var err = new Error("Cancelled after giving " + given_answers + " answers.");
    callback(err, answers);
  });

}
