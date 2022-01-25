#![deny(clippy::all)]

mod longest_increasing;
use longest_increasing as li;

#[macro_use]
extern crate napi_derive;

use napi::bindgen_prelude::AsyncTask;

#[napi]
pub fn create_longest_increasing_sub_sequences(
  seq: Vec<Vec<i32>>,
) -> AsyncTask<li::AsyncLongestIncreasing> {
  AsyncTask::new(li::AsyncLongestIncreasing::new(seq))
}
