# merkle commitment scheme on *list of raw bytes*, uses sha256
import math
import hashlib 

class leafNode:
    
    def __init__(self,file,idx,isPad):
        sha256 = hashlib.sha256()
        sha256.update(b"leaf:")  
        sha256.update(file)
        self.preimage = file
        self.data = sha256.digest()
        self.Proof = []
        self.idx = idx
        self.isPad = isPad 
        self.parent = None

    def __str__(self):
        return self.data
    
    
    
class internalNode:

    def __init__(self,left,right,idx):
        self.left = left
        self.right = right
        self.parent = None 
        self.idx = idx 
        left.parent = self
        right.parent = self

    def __str__(self):
        return self.data
    
    def updateHash(self):
        assert self.left and self.right 
        sha256 = hashlib.sha256()
        sha256.update(b"node:")   
        sha256.update(self.left.data)
        sha256.update(self.right.data)
        self.data = sha256.digest()
        return self.data 
        


class merkleTree:

    def __init__(self, files):
        data = files
        self.numFiles = len(files)
        height = math.ceil(math.log(len(files),2))
        self.h = height 
        padlen = (2**height)-len(files)
        data += [b"\x00"] * padlen

        self.leafs = []
        for i in range(len(data)):
            self.leafs.append(leafNode(data[i] ,i ,i >= self.numFiles))

        self.commit()
    

    def commit(self):

        current = self.leafs
        for h in range(self.h):
            parents = []
            for i in range(0,len(current),2):
                n = internalNode(current[i],current[i+1],i/2)
                n.updateHash()
                parents.append(n)
            current = parents
        self.root = current[0]

        return self.root.data


            
    def appendLeaf(self,newFile):
        #return idx and updated merkle root. 
        idx = 0 
        if self.numFiles < len(self.leafs):
            #padding available. 
            idx = self.numFiles
            assert self.leafs[idx].isPad == True 
            self.leafs[idx] = leafNode(newFile,idx,False)
        
        else:
            idx = len(self.leafs)
            self.leafs.append(leafNode(newFile ,idx ,False))
            #padd the tree to nearest power of 2
            height = math.ceil(math.log(len(self.leafs),2))
            self.h = height 
            padlen = (2**height)-len(self.leafs)
            for i in range(1,padlen+1):
                self.leafs.append(leafNode(b"\x00",idx+i,True))

        self.numFiles += 1 
        r = self.commit()
        return (idx,r)

    def updateLeaf(self,idx,update):
        assert idx < self.numFiles
        self.leafs[idx] = leafNode(update,idx,False)
        r = self.commit()
        return (idx,r)

    def deleteLeaf(self,idx):
        # can be done by using nullifier b"\x00" and queue indexing, not implemented 
        # the file system does not support delete for now 
        pass 

    def open(self,idx):
        current = self.leafs[idx]
        path = []
        while current.parent:
            if current.idx % 2 == 0:
                #left
                path.append(current.parent.right.data)
            else:
                #right
                path.append(current.parent.left.data)
            current = current.parent
        self.leafs[idx].Proof = path
        return path, self.leafs[idx].preimage

    def verify(self,idx,proof):
        #user should implement merkle verify themselves to check the validity of the merkel proof
        pass 

if __name__ == "__main__":
    m = merkleTree([b'a',b'b',b'c',b'd',b'e'])
    m.appendLeaf(b"abc")
    m.updateLeaf(2,b'ac')
    print(m.open(2))
