//// Sample programs

import {
  debug,
  equiv,
  call_fresh,
  empty_state,
  print_stream,
  disj,
  conj,
  take,
  delay,
  lazy_conj,
  lazy_disj
} from "./microkanren.mjs";

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

const sample4a = () => {
  console.log("== sample 4a : fives with take ==");

  const fives = x => disj(equiv(x, 5), state => () => fives(x)(state));

  const res = call_fresh(fives)(empty_state());
  const ret5 = take(5, res);

  print_stream(ret5);
};

// sample4a();

const sample4b = () => {
  console.log("== sample 4b : fives with delay ==");

  const fives = x => disj(equiv(x, 5), delay(() => fives(x)));

  const res = call_fresh(fives)(empty_state());
  const ret5 = take(5, res);

  print_stream(ret5);
};

// sample4b();

const sample4c = () => {
  console.log("== sample 4c : fives with delay ==");

  const fives = x => lazy_disj(() => equiv(x, 5), () => fives(x));

  const res = call_fresh(fives)(empty_state());
  // console.log(`res : ${res}`);
  // console.log(`res() : ${res()}`);

  const ret5 = take(5, res);

  console.log(ret5);
  // print_stream(res);
};

sample4c();

const sample5 = () => {
  console.log("== sample 5 : fives-and-sixes ==");

  const fives = x => disj(equiv(x, 5), state => () => fives(x)(state));
  const sixes = x => disj(equiv(x, 6), state => () => sixes(x)(state));
  const fives_and_sixes = call_fresh(x => disj(fives(x), sixes(x)));

  const res = fives_and_sixes(empty_state());

  print_stream(res);
};

// sample5();

const sample6 = () => {
  // from https://github.com/shd101wyy/logic.js/blob/master/docs/logic.js.md

  const parent = (x, y) =>
    disj(
      conj(equiv(x, "amy"), equiv(y, "bob")),
      conj(equiv(x, "bob"), equiv(y, "marco"))
    );

  const grandparent = (x, z) => {
    return call_fresh(v => conj(parent(x, v), parent(v, z)));
  };

  print_stream(call_fresh(() => grandparent("amy", "marco"))(empty_state()));
  print_stream(call_fresh(x => grandparent(x, "marco"))(empty_state()));
};

// sample6();
