////// Debugging Utilities

// if /System/Library/Frameworks/JavaScriptCore.framework/Resources/jsc
// let console = { log: print };

let nebug = () => {};
let debug = console.log;
let enable_debug = 0;

if (enable_debug) {
  nebug = debug;
}

////// Data Structures
// - logical variable : Var
// - substitution : Substitution
// - substitution list : [Substitution]
// - state : State
// - stream : [State]

//// Var : logical variable
export //
function Var(val) {
  this.val = val;
}

Var.prototype.toString = function() {
  return String(this.val);
};

const is_var = v => v instanceof Var;

const is_equal = (v1, v2) => v1.val == v2.val;

//// Substitution
// fst : Var or value
// snd : Var or value
export //
function Substitution(fst, snd) {
  this.fst = fst;
  this.snd = snd;
}

Substitution.prototype.toString = function() {
  let fst_data = this.fst;
  if (is_var(this.fst)) {
    fst_data = `Var(${this.fst.val})`;
  }

  let snd_data = this.snd;
  if (is_var(this.snd)) {
    snd_data = `Var(${this.snd.val})`;
  }

  return `Substitution { fst: ${fst_data}, snd: ${snd_data} }`;
};

//// Substitution List
// we use Array for the substitution list

// extends substitution list
// v : Var
// val : value
// slist : substitution list
const extend_slist = (v, val, slist) => {
  let ret = Array.from(slist);
  ret.push(new Substitution(v, val));

  return ret;
};

//// State : a pair of a substitution list and a counter
// slist : a substitution list
// counter : integer
export //
function State(slist, counter) {
  this.slist = slist;
  this.cntr = counter;
}

State.prototype.toString = function() {
  let slist_data = "";
  for (let subst of this.slist) {
    slist_data += subst.toString();
    slist_data += ", ";
  }
  slist_data = slist_data.substr(0, slist_data.length - 2);

  return `State { slist : [ ${slist_data} ], cntr : ${this.cntr} }`;
};

const empty_state = () => new State([], 0);

//// Stream : a sequence of State
// we use Array for the stream

// stream_from : make a stream from a state
// original : unit
const stream_from = state => [state];

// empty_stream : make an empty stream
// original : mzero
export //
const empty_stream = () => [];

// print contents of a stream
const print_stream = strm => strm.forEach(v => console.log(v.toString()));

////// Functions
// - walk
// - unify
// - equiv
// - call_fresh
// - disj
// - conj
// - merge_stream
// - bind

// walk
export //
const walk = (term, slist) => {
  nebug("== walk ==");
  nebug(`term: ${term}`);
  nebug(`subst: ${slist}`);

  let predicates = null;

  if (is_var(term)) {
    predicates = slist.filter(subst => is_equal(term, subst.fst));
  }

  nebug(`predicates: ${predicates}`);

  if (predicates && predicates.length !== 0) {
    return walk(predicates[0].snd, slist);
  } else {
    return term;
  }
};

//// unification

// unify : do unification
// term1 : Var or value
// term2 : Var or value
// slist : a substitution list
// returns : a substitution list or false
export //
const unify = (term1, term2, slist) => {
  const u = walk(term1, slist);
  const v = walk(term2, slist);

  if (is_var(u) && is_var(v) && is_equal(u, v)) {
    nebug("var u and var v and equal");
    return slist;
  }

  if (is_var(u)) {
    nebug("var u and val v");
    return extend_slist(u, v, slist);
  }

  if (is_var(v)) {
    nebug("var v and val u");
    return extend_slist(v, u, slist);
  }

  if (u instanceof Substitution && v instanceof Substitution) {
    nebug("subst u and subst v");
    const s = unify(u.fst, v.fst, slist);
    if (s) {
      return unify(u.snd, v.snd, slist);
    } else {
      return false;
    }
  }

  if (u === v) {
    return slist;
  } else {
    return false;
  }
};

//// goal constructors
// - equiv
// - call_fresh
// - disj
// - conj

// equiv : equivalent
// original : ==
// state : State
export //
const equiv = (term1, term2) => state => {
  nebug("== equiv ==");
  nebug(`term1 : ${term1}`);
  nebug(`term2 : ${term2}`);
  nebug(`state : ${state.toString()}`);

  const slist = unify(term1, term2, state.slist);

  if (slist) {
    nebug("stream_from");
    return stream_from(new State(slist, state.cntr));
  } else {
    nebug("empty_stream");
    return empty_stream();
  }
};

// call_fresh
// original : call/fresh
export //
const call_fresh = fun => state => {
  nebug("== call_fresh ==");
  nebug(`fun : ${fun}`);
  nebug(`state : ${state.toString()}`);

  let cnt = state.cntr;

  const f = fun(new Var(cnt));
  cnt++;

  nebug(`f : ${f}`);
  nebug(`state.slist : ${state.slist}`);

  return f(new State(state.slist, cnt));
};

// disjunction
// g1 : goal function 1
// g2 : goal function 2
// state : State
export //
const disj = (g1, g2) => state => merge_stream(g1(state), g2(state));

// conjunction
// g1 : goal function 1
// g2 : goal function 2
// state : State
export //
const conj = (g1, g2) => state => bind(g1(state), g2);

// merge_stream : merge two streams
// original : mplus
// strm1 : first stream
// strm2 : second stream
// returns : a merged stream
export //
const merge_stream = (strm1, strm2) => {
  nebug(`== merge_stream ==`);
  nebug(`strm1 : ${strm1}`);
  nebug(`strm2 : ${strm2}`);

  if (strm1.length === 0) {
    nebug("= strm1.length === 0");
    return strm2;
  }

  if (strm1 instanceof Function) {
    nebug("= strm1 instanceof Function");
    return () => merge_stream(strm2, strm1());
  }

  nebug("= other");
  nebug(`strm1.slice(0, 1) : ${strm1.slice(0, 1)}`);
  nebug(`strm1.slice(1) : ${strm1.slice(1)}`);

  let result = strm1.slice(0, 1);
  result.push(merge_stream(strm1.slice(1), strm2));

  nebug(`result : ${result}`);
  return result;
};

// bind
// strm : stream
// goal : goal function
// returns : a function or a stream
export //
const bind = (strm, goal) => {
  nebug("== bind ==");
  nebug(`strm : ${strm}`);
  nebug(`goal : ${goal}`);

  if (strm.length === 0) {
    nebug("= strm.length === 0");
    return empty_stream();
  }

  if (strm instanceof Function) {
    nebug("= strm instanceof Function");
    return () => bind(strm(), goal);
  }

  nebug("= other");
  nebug(`strm.slice[0] : ${strm.slice[0]}`);
  nebug(`strm.slice(1) : ${strm.slice(1)}`);

  // pick one and apply the goal to it.
  nebug("= g1");
  const g1 = goal(strm[0]);
  nebug(`g1 : ${g1})`);

  // bind rest.
  nebug("= g2");
  const g2 = bind(strm.slice(1), goal);
  nebug(`g2 : ${g2})`);

  return merge_stream(g1, g2);
};
