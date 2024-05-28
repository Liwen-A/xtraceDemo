# built file indexing scheme over s3, integrated with merkle commitment 


import boto3
from merkle import merkleTree


class zkDFS:
#loads a bucket, compute a merkle tree and maintain it in memory.
#Implements an indexing scheme that is compatible with the underlying merkel commitment. 
    def __init__(self,bucketName):
        s3 = boto3.resource('s3')
        self.bucket = s3.Bucket(bucketName)
        files = [obj.get()['Body'].read() for obj in self.bucket.objects.all()]
        self.mt = merkleTree(files)
        self.s3Key2Idx = {}
        for i,v in enumerate([obj.key for obj in self.bucket.objects.all()]):
            self.s3Key2Idx[v] = i 
    
    def listKeys(self):
        return [obj.key for obj in self.bucket.objects.all()]
    
    def fileIdx(self,key):
        return self.s3Key2Idx[key]

    def put(self,file,key):
        #returns file idx, and new commitment.
        assert key not in self.s3Key2Idx
        self.bucket.Object(key=key).put(Body=file)
        #need to write to s3 and then read from s3 for proper encoding for sha256
        file = self.bucket.Object(key=key).get()["Body"].read()
        idx,r = self.mt.appendLeaf(file)
        self.s3Key2Idx[key]= idx 
        return idx,r

    def get(self,key):
        #returns file content, and merkel proof.
        assert key in self.s3Key2Idx
        file = self.bucket.Object(key=key).get()["Body"].read()
        proof = self.mt.open(self.fileIdx(key))
        return {'content':file,'proof':proof}

if __name__ == "__main__":
    bName = 'verkel-tree-file-system-test'
    fs = zkDFS(bName)
    print(fs.listKeys())