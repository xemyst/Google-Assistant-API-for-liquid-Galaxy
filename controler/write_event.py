class timeval(Structure):
    _fields_ = [("tv_sec",c_long),
                 ("tv_usec", c_long)]
class event(Structure):
