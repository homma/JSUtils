////// Data Structures

const debug = console.log;
const nebug = () => {};

//// Pair
function Pair(fst, snd) {
  this.fst = fst;
  this.snd = snd;
}

//// Substitution
function Substitution(fst, snd) {
  this.fst = fst;
  this.snd = snd;
}

//// State : a pair of a substitution list and a counter
function State(substitution_list, counter) {
  this.slist = substitution_list;
  this.cntr = counter;
}

//// logical variable

function Var(val) {
  this.val = val;
}

const is_var = x => x instanceof Var;

const is_equal = (x1, x2) => x1.val == x2.val;

const test_var = () => {
  console.log("== test var ==");

  const a = new Var(3);
  const b = new Var(4);
  const res = is_equal(a, b);
  console.log(res);
};

// test_var();

//// walk

const walk = (term, slist) => {
  debug("== walk ==");
  debug(`term: ${term}`);
  debug(`subst: ${slist}`);

  let predicates = null;

  if (is_var(term)) {
    predicates = slist.filter(subst => is_equal(term, subst.fst));
  }

  debug(`predicates: ${predicates}`);

  if (predicates && predicates.length !== 0) {
    return walk(predicates[0].snd, slist);
  } else {
    return term;
  }
};

const test_walk = () => {
  console.log("== test walk ==");

  const slist = [
    new Substitution(new Var(0), new Var(1)),
    new Substitution(new Var(1), "foo")
  ];

  let res = walk(new Var(0), slist);
  console.log(`result is ${res}`);

  res = walk(new Var(1), slist);
  console.log(`result is ${res}`);

  res = walk("bar", slist);
  console.log(`result is ${res}`);
};

// test_walk();

// extends substitution list
// v : Var
// val : value
// slist : substitution list
const extend_slist = (v, val, slist) => {
  let ret = Array.from(slist);
  ret.push(new Substitution(v, val));

  return ret;
};

const unit = sc => new Pair(sc, mzero);

const mzero = [];

//// unification

const unify = (term1, term2, slist) => {
  const u = walk(term1, slist);
  const v = walk(term2, slist);

  if (is_var(u) && is_var(v) && is_equal(u, v)) {
    debug("var u and var v and equal");
    return slist;
  }

  if (is_var(u)) {
    debug("var u and val v");
    return extend_slist(u, v, slist);
  }

  if (is_var(v)) {
    debug("var v and val u");
    return extend_slist(v, u, slist);
  }

  if (u instanceof Substitution && v instanceof Substitution) {
    debug("subst u and subst v");
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

const test_unify = () => {
  console.log("== test unify ==");

  let test_no = 0;
  let t1 = null;
  let t2 = null;
  let slist = null;

  console.log(`== test unify ${test_no} ==`);
  test_no++;
  t1 = new Var(0);
  t2 = new Var(0);
  slist = [];
  console.log(`t1: ${t1}, t2: ${t2}, slist: ${slist}`);
  console.log(unify(t1, t2, slist));

  console.log(`== test unify ${test_no} ==`);
  test_no++;
  t1 = new Var(0);
  t2 = "foo";
  slist = [];
  console.log(`t1: ${t1}, t2: ${t2}, slist: ${slist}`);
  console.log(unify(t1, t2, slist));

  console.log(`== test unify ${test_no} ==`);
  test_no++;
  t1 = "foo";
  t2 = new Var(0);
  slist = [];
  console.log(`t1: ${t1}, t2: ${t2}, slist: ${slist}`);
  console.log(unify(t1, t2, slist));

  console.log(`== test unify ${test_no} ==`);
  test_no++;
  t1 = new Var(0);
  t2 = "foo";
  slist = [new Substitution(new Var(0), "bar")];
  console.log(`t1: ${t1}, t2: ${t2}, slist: ${slist}`);
  console.log(unify(t1, t2, slist));

  console.log(`== test unify ${test_no} ==`);
  test_no++;
  t1 = new Var(0);
  t2 = "foo";
  slist = [new Substitution(new Var(1), "bar")];
  console.log(`t1: ${t1}, t2: ${t2}, slist: ${slist}`);
  console.log(unify(t1, t2, slist));

  console.log(`== test unify ${test_no} ==`);
  test_no++;
  t1 = new Var(0);
  t2 = "foo";
  slist = [
    new Substitution(new Var(1), new Var(2)),
    new Substitution(new Var(2), "bar")
  ];
  console.log(`t1: ${t1}, t2: ${t2}, slist: ${slist}`);
  console.log(unify(t1, t2, slist));

  console.log(`== test unify ${test_no} ==`);
  test_no++;
  t1 = "foo";
  t2 = "foo";
  slist = [];
  console.log(`t1: ${t1}, t2: ${t2}, slist: ${slist}`);
  console.log(unify(t1, t2, slist));
};

// test_unify();

//// goal constructors

// equivalent : ==
// sc : State
const equivalent = (term1, term2) => sc => {
  const s = unify(term1, term2, sc.slist);

  if (s) {
    debug("unit");
    return unit(new State(s, sc.cntr));
  } else {
    debug("mzero");
    return mzero;
  }
};

const call_fresh = f => sc => {
  let cnt = sc.cntr;
  const fun = f(new Var(cnt));
  cnt++;
  fun(new State(sc.slist, cnt));
};

const disj = (g1, g2) => sc => mplus(g1(sc), g2(sc));

const conj = (g1, g2) => sc => bind(g1(sc), g2);

const mplus = (strm1, strm2) => {
  if (strm1 === null) {
    return strm2;
  }

  if (strm1 instanceof Function) {
    return () => mplus(strm2, strm1());
  }

  return new Pair(strm1.slist, mplus(strm1.cntr, strm2));
};

const bind = (strm, g) => {
  if (strm === null) {
    return mzero;
  }

  if (strm instanceof Function) {
    return () => bind(strm(), g);
  }

  return mplus(g(strm.subst), bind(strm.cntr, g));
};

//// Test

const test1 = () => {
  const empty_state = new State([], 0);
  const f = call_fresh(q => equivalent(q, 5));
  const res = f(empty_state);
  console.log(res);
};

// test1();
