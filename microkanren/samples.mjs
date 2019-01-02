//// Sample programs

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

const sample3 = () => {
  console.log("== sample 3 : fives (fails with stack exaustion) ==");

  const fives = x => disj(equiv(x, 5), fives(x));

  const res = call_fresh(fives)(empty_state());
  print_stream(res);
};

// sample3();

const sample4 = () => {
  console.log("== sample 4 : fives ==");

  const fives = x => disj(equiv(x, 5), state => () => fives(x)(state));

  const res = call_fresh(fives)(empty_state());
  print_stream(res);
};

// sample4();

const sample5 = () => {
  console.log("== sample 5 : fives-and-sixes ==");

  const fives = x => disj(equiv(x, 5), state => () => fives(x)(state));
  const sixes = x => disj(equiv(x, 6), state => () => sixes(x)(state));
  const fives_and_sixes = call_fresh(x => disj(fives(x), sixes(x)));

  const res = fives_and_sixes(empty_state());

  print_stream(res);
};

// sample5();
