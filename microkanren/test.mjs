const test_var = () => {
  console.log("== test var ==");

  const a = new Var(3);
  const b = new Var(4);
  const res = is_equal(a, b);
  console.log(res);
};

// test_var();

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

//// Test

const test1 = () => {
  const empty_state = new State([], 0);
  const f = call_fresh(q => equivalent(q, 5));
  const res = f(empty_state);
  console.log(res);
};

// test1();

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
