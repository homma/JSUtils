
## goal
- goal is a predicate
- is applied to a state
- results in succeed or fail
- when success, it may generate a stream

## stream
- a sequence of states
- finite or infinite

## goal constructors
- there are four goal constructors in microKanren
- ≡
- call/fresh
- disj
- conj

## ≡ or ==
- check if a given two terms unifies

## call/fresh
- creates new logic variable
- takes a unary function

## disj
- disjunction of two goals
- check if one of the two goals is successful
- if successful, returns a non-empty stream

## conj
- conjunction of two goals
- evaluate the first goal and get a stream
- evaluate the second goal with the returned stream
- check if the second goal is successful

## state
- a pair of a substitution and a counter

## substitution
- a pair of a logical variable and a value
- the value can be a logical variable as well

## triangular substitution
- a pair of logical variables

## counter
- is an integer
- represents the number of variables

## empty state
- an empty substition and counter zero
