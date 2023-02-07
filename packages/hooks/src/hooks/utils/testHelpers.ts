export function request(req: number) {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (req === 0) {
        reject(new Error('fail'));
      } else {
        resolve('success');
      }
    }, 1000)
  );
}
