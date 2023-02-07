export function request(req: number): Promise<string> {
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
