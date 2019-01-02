//// Debugging Utilities

// if /System/Library/Frameworks/JavaScriptCore.framework/Resources/jsc
// let console = { log: print };

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

const empty_state = () => new State([], 0);

// Stream : a sequence of State
// we use Array for the stream

const print_stream = strm => strm.forEach(v => console.log(v.toString()));

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

// equiv : equivalent
// original : ==
// state : State
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
// g1 : goal1
// g2 : goal2
const disj = (g1, g2) => state => merge_stream(g1(state), g2(state));

// conjunction
// g1 : goal1
// g2 : goal2
const conj = (g1, g2) => state => bind(g1(state), g2);

// merge_stream : merge two streams
// original : mplus
// strm1 : first stream
// strm2 : second stream
// returns : a merged stream
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

//// Samples

const sample1 = () => {
  console.log("== sample 1 ==");
  const res = call_fresh(q => equiv(q, 5))(empty_state());
  print_stream(res);
};

// sample1();

const sample2 = () => {
  console.log("== sample 2 : a-and-b ==");
  const a_and_b = conj(
    call_fresh(a => equiv(a, 7)),
    call_fresh(b => disj(equiv(b, 5), equiv(b, 6)))
  );
  const res = a_and_b(empty_state());
  print_stream(res);
};

// sample2();

//// Test

const test1 = () => {
  const f = call_fresh(q => equiv(q, 5));
  const res = f(empty_state());
  res.forEach(v => console.log(v.toString()));
};

// test1();

const disj_test = () => {
  console.log("== disj test ==");

  const g1 = call_fresh(a => equiv(a, 7));
  const g2 = call_fresh(b => equiv(b, 8));
  const res = disj(g1, g2)(empty_state());
  // console.log(res);
  print_stream(res);
};

// disj_test();

const conj_test = () => {
  console.log("== conj test ==");

  const g1 = call_fresh(a => equiv(a, 7));
  const g2 = call_fresh(b => equiv(b, 8));
  const res = conj(g1, g2)(empty_state());
  // console.log(res);
  print_stream(res);
};

// conj_test();
