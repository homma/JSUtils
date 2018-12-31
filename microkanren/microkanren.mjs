//// Debugging Utilities

let nebug = () => {};
let debug = console.log;
let enable_debug = 0;

if (enable_debug) {
  nebug = debug;
}

//// Data Structures

// Var : logical variable
function Var(val) {
  this.val = val;
}

Var.prototype.toString = function() {
  return String(this.val);
};

const is_var = v => v instanceof Var;

const is_equal = (v1, v2) => v1.val == v2.val;

// Substitution
// fst : Var or value
// snd : Var or value
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

// State : a pair of a substitution list and a counter
// slist : a substitution list
// counter : integer
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

// Stream : a sequence of State
// we use Array for the stream

//// walk

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

// extends substitution list
// v : Var
// val : value
// slist : substitution list
const extend_slist = (v, val, slist) => {
  let ret = Array.from(slist);
  ret.push(new Substitution(v, val));

  return ret;
};

// stream_from : unit ; make stream
const stream_from = state => [state];

// empty_stream : mzero ; empty stream
const empty_stream = () => [];

//// unification

// unify : do unification
// term1 : Var or value
// term2 : Var or value
// slist : a substitution list
// returns : a substitution list or false
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

// equivalent : ==
// state : State
const equivalent = (term1, term2) => state => {
  const slist = unify(term1, term2, state.slist);

  if (slist) {
    nebug("stream_from");
    return stream_from(new State(slist, state.cntr));
  } else {
    nebug("empty_stream");
    return empty_stream();
  }
};

const call_fresh = fun => state => {
  let cnt = state.cntr;
  const f = fun(new Var(cnt));
  cnt++;
  return f(new State(state.slist, cnt));
};

// disjunction
const disj = (goal1, goal2) => state =>
  merge_stream(goal1(state), goal2(state));

// conjunction
const conj = (goal1, goal2) => state => bind(goal1(state), goal2);

// merge_stream : merge two streams
// original : mplus
// strm1 : first stream
// strm2 : second stream
// returns : a merged stream
const merge_stream = (strm1, strm2) => {
  if (strm1.length === 0) {
    return strm2;
  }

  // strm1[0]?
  if (strm1 instanceof Function) {
    return () => merge_stream(strm2, strm1());
  }

  strm1.slice(0, 1).push(merge_stream(strm1(1), strm2));
  return strm1;
};

const bind = (strm, goal) => {
  if (strm.length === 0) {
    return empty_stream();
  }

  if (strm instanceof Function) {
    return () => bind(strm(), goal);
  }

  return merge_stream(goal(strm.slice(0, 1)), bind(strm.slice(1), goal));
};

//// Test

const test1 = () => {
  const empty_state = new State([], 0);
  const f = call_fresh(q => equivalent(q, 5));
  const res = f(empty_state);
  res.forEach(v => console.log(v.toString()));
};

test1();
