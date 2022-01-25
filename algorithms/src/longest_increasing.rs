use napi::{Env, Result, Task};

pub struct AsyncLongestIncreasing {
  seq: Vec<Vec<i32>>,
}

impl AsyncLongestIncreasing {
  pub fn new(seq: Vec<Vec<i32>>) -> AsyncLongestIncreasing {
    AsyncLongestIncreasing { seq }
  }
}

#[napi]
impl Task for AsyncLongestIncreasing {
  type Output = Vec<Vec<i32>>;
  type JsValue = Vec<Vec<i32>>;

  fn compute(&mut self) -> Result<Self::Output> {
    Ok(
      self
        .seq
        .iter()
        .map(|s| longest_increasing_sub_seq(&s[..]))
        .collect::<Self::Output>(),
    )
  }

  fn resolve(&mut self, _: Env, output: Vec<Vec<i32>>) -> Result<Self::JsValue> {
    Ok(output)
  }
}

fn longest_increasing_sub_seq(seq: &[i32]) -> Vec<i32> {
  if seq.len() == 1 {
    return vec![seq[0]];
  }
  let mut longest = longest_increasing_sub_seq(&seq[1..]);
  if seq[0] <= longest[0] {
    longest.insert(0, seq[0]);
  } else if longest[0] < seq[0] && (longest.len() == 1 || seq[0] <= longest[1]) {
    longest[0] = seq[0];
  }
  longest
}

#[cfg(test)]
mod tests {
  use super::*;
  #[test]
  fn test_longest_increasing_sub_seq_1() {
    let seq = vec![2, 4, 1, 5, 3];
    assert_eq!(longest_increasing_sub_seq(&seq[..]), vec![2, 4, 5]);
  }

  #[test]
  fn test_longest_increasing_sub_seq_2() {
    let seq = vec![0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15];
    assert_eq!(
      longest_increasing_sub_seq(&seq[..]),
      vec![0, 4, 6, 9, 11, 15]
    );
  }
}
